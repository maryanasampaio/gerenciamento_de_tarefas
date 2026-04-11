type BrowserCoordinates = {
  latitude: number;
  longitude: number;
};

export type WeatherSnapshot = {
  cidade: string;
  temperatura: number;
  condicao: string;
  umidade: number;
  vento: string;
  recomendacao: string;
};

function withTimeout<T>(promise: Promise<T>, timeoutMs = 15000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error("Tempo limite excedido ao buscar clima")), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function getCurrentPosition(): Promise<BrowserCoordinates> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocalização não é suportada neste navegador"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("Permissão de localização negada"));
          return;
        }
        reject(new Error("Não foi possível obter sua localização"));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  });
}

function mapWeatherCodeToCondition(code: number): string {
  if (code === 0) return "Céu limpo";
  if (code >= 1 && code <= 3) return "Parcialmente nublado";
  if (code === 45 || code === 48) return "Névoa";
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "Chuva";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "Neve";
  if (code >= 95 && code <= 99) return "Tempestade";
  return "Variação climática";
}

function getRecommendation(temperatura: number, condicao: string): string {
  if (condicao.includes("Chuva") || condicao.includes("Tempestade")) {
    return "Leve guarda-chuva e considere atividade indoor.";
  }
  if (temperatura >= 32) {
    return "Evite horários de pico de calor e hidrate-se bem.";
  }
  if (temperatura <= 12) {
    return "Use agasalho e faça um aquecimento mais longo.";
  }
  return "Bom momento para atividades ao ar livre.";
}

async function reverseGeocodeCity(latitude: number, longitude: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  const response = await withTimeout(fetch(url, { headers: { Accept: "application/json" } }), 15000);

  if (!response.ok) {
    return "Sua região";
  }

  const data = await response.json();
  const address = data?.address;
  return (
    address?.city ||
    address?.town ||
    address?.village ||
    address?.municipality ||
    address?.state ||
    "Sua região"
  );
}

async function fetchWeather(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
    timezone: "auto",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const response = await withTimeout(fetch(url, { headers: { Accept: "application/json" } }), 15000);
  if (!response.ok) {
    throw new Error("Não foi possível obter clima atual");
  }

  return response.json();
}

export async function getCurrentWeatherSnapshot(): Promise<WeatherSnapshot> {
  const { latitude, longitude } = await getCurrentPosition();

  const [city, weatherResponse] = await Promise.all([
    reverseGeocodeCity(latitude, longitude),
    fetchWeather(latitude, longitude),
  ]);

  const current = weatherResponse?.current;
  const temperature = Math.round(Number(current?.temperature_2m ?? 0));
  const humidity = Math.round(Number(current?.relative_humidity_2m ?? 0));
  const windSpeed = Number(current?.wind_speed_10m ?? 0);
  const weatherCode = Number(current?.weather_code ?? 0);
  const condition = mapWeatherCodeToCondition(weatherCode);

  return {
    cidade: city,
    temperatura: temperature,
    condicao: condition,
    umidade: humidity,
    vento: `${Math.round(windSpeed)} km/h`,
    recomendacao: getRecommendation(temperature, condition),
  };
}
