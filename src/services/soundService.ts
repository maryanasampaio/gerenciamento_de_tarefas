/**
 * Serviço centralizado de sons para a aplicação
 * 
 * Todos os sons são gerados sinteticamente usando Web Audio API,
 * garantindo que funcionem em qualquer navegador e não precisem de arquivos externos.
 * 
 * Uso:
 * - SoundService.playTimerComplete() - Quando um timer (Pomodoro, leitura) terminar
 * - SoundService.playAlert() - Para alertas urgentes
 * - SoundService.playNotification() - Para notificações suaves
 * - SoundService.playCelebration() - Quando uma meta/tarefa for concluída
 */

export class SoundService {
  /**
   * Toca um som de alarme agradável quando um timer termina
   * Usa Web Audio API para criar um som sintético que sempre funciona
   */
  static playTimerComplete() {
    try {
      const globalObj: any = globalThis as any;
      const AudioContextClass = globalObj.AudioContext || globalObj.webkitAudioContext;
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const now = audioContext.currentTime;

      // Som de sucesso/conclusão: uma sequência melódica ascendente
      const notes = [
        { freq: 523.25, duration: 0.15 }, // C5
        { freq: 659.25, duration: 0.15 }, // E5
        { freq: 783.99, duration: 0.3 }   // G5 (mais longo)
      ];

      let currentTime = now;

      notes.forEach((note, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Tom suave (sine wave)
        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';

        const startTime = currentTime;
        const endTime = startTime + note.duration;

        // Envelope ADSR suave
        gainNode.gain.setValueAtTime(0.001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.2, startTime + note.duration * 0.7);
        gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

        oscillator.start(startTime);
        oscillator.stop(endTime + 0.05);

        currentTime = endTime + 0.05;
      });

      // Fecha o contexto após os sons
      setTimeout(() => {
        audioContext.close();
      }, 1000);
    } catch (error) {
      console.warn('Não foi possível tocar o som:', error);
    }
  }

  /**
   * Toca um som de alerta/atenção (mais urgente)
   */
  static playAlert() {
    try {
      const globalObj: any = globalThis as any;
      const AudioContextClass = globalObj.AudioContext || globalObj.webkitAudioContext;
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const now = audioContext.currentTime;

      // Dois bipes rápidos e agudos
      const beeps = [
        { freq: 880, duration: 0.1 },  // A5
        { freq: 880, duration: 0.1 }   // A5
      ];

      beeps.forEach((beep, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = beep.freq;
        oscillator.type = 'square';

        const startTime = now + index * 0.2;
        const endTime = startTime + beep.duration;

        gainNode.gain.setValueAtTime(0.001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.25, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

        oscillator.start(startTime);
        oscillator.stop(endTime + 0.01);
      });

      setTimeout(() => {
        audioContext.close();
      }, 500);
    } catch (error) {
      console.warn('Não foi possível tocar o alerta:', error);
    }
  }

  /**
   * Toca um som de notificação suave
   */
  static playNotification() {
    try {
      const globalObj: any = globalThis as any;
      const AudioContextClass = globalObj.AudioContext || globalObj.webkitAudioContext;
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const now = audioContext.currentTime;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      oscillator.start(now);
      oscillator.stop(now + 0.25);

      setTimeout(() => {
        audioContext.close();
      }, 300);
    } catch (error) {
      console.warn('Não foi possível tocar a notificação:', error);
    }
  }

  /**
   * Toca um som de sucesso/celebração
   */
  static playCelebration() {
    try {
      const globalObj: any = globalThis as any;
      const AudioContextClass = globalObj.AudioContext || globalObj.webkitAudioContext;
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const now = audioContext.currentTime;

      // Arpejo ascendente alegre
      const notes = [
        { freq: 523.25, duration: 0.1 },  // C5
        { freq: 659.25, duration: 0.1 },  // E5
        { freq: 783.99, duration: 0.1 },  // G5
        { freq: 1046.5, duration: 0.25 } // C6 (oitava acima, mais longo)
      ];

      let currentTime = now;

      notes.forEach((note) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';

        const startTime = currentTime;
        const endTime = startTime + note.duration;

        gainNode.gain.setValueAtTime(0.001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

        oscillator.start(startTime);
        oscillator.stop(endTime + 0.02);

        currentTime = endTime;
      });

      setTimeout(() => {
        audioContext.close();
      }, 800);
    } catch (error) {
      console.warn('Não foi possível tocar a celebração:', error);
    }
  }
}
