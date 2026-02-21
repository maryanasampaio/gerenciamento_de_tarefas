import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, BellOff, CheckCircle2, Calendar, Sparkles, Clock } from "lucide-react";

export const NotificationSettings = () => {
  const {
    permission,
    isSupported,
    settings,
    isLoading,
    saveSettings,
    requestPermission,
    sendTestNotification
  } = useNotifications();

  if (!isSupported) {
    return (
      <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <BellOff className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">
                Notificações não suportadas
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Seu navegador não suporta notificações push. Tente usar Chrome, Firefox ou Edge.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleToggleEnabled = async () => {
    if (settings.enabled) {
      saveSettings({ ...settings, enabled: false });
    } else {
      const granted = await requestPermission();
      if (granted) {
        await sendTestNotification();
      }
    }
  };

  const handleToggleSetting = (key: keyof typeof settings) => {
    saveSettings({ ...settings, [key]: !settings[key] });
  };

  const handleTimeChange = (time: string) => {
    saveSettings({ ...settings, reminderTime: time });
  };

  const handleDaysChange = (days: number) => {
    saveSettings({ ...settings, daysBeforeDeadline: days });
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-200 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-gray-900 dark:text-white">
              Notificações Push
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Receba lembretes mesmo fora do app
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Status da permissão */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            {permission === 'granted' ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Notificações Permitidas
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Você receberá lembretes
                  </p>
                </div>
              </>
            ) : (
              <>
                <BellOff className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Notificações Desativadas
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ative para receber lembretes
                  </p>
                </div>
              </>
            )}
          </div>
          <Button
            onClick={handleToggleEnabled}
            disabled={isLoading}
            className={`${
              settings.enabled
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
            } text-white`}
          >
            {isLoading ? 'Carregando...' : settings.enabled ? 'Desativar' : 'Ativar'}
          </Button>
        </div>

        {permission === 'granted' && settings.enabled && (
          <>
            {/* Tipos de notificações */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-900 dark:text-white">
                Tipos de Notificações
              </Label>

              <div className="space-y-3">
                {/* Lembretes de tarefas */}
                <div
                  onClick={() => handleToggleSetting('taskReminders')}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Lembretes de Tarefas
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Notificação diária com tarefas pendentes
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.taskReminders
                        ? 'bg-cyan-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    } relative`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.taskReminders ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>

                {/* Prazos de metas */}
                <div
                  onClick={() => handleToggleSetting('goalDeadlines')}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Prazos de Metas
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Avisos quando metas estão próximas do prazo
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.goalDeadlines
                        ? 'bg-amber-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    } relative`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.goalDeadlines ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>

                {/* Celebrações */}
                <div
                  onClick={() => handleToggleSetting('celebrations')}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Celebrações
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Parabéns ao concluir metas e tarefas
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.celebrations
                        ? 'bg-pink-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    } relative`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.celebrations ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configurações de horário */}
            {settings.taskReminders && (
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário do Lembrete Diário
                </Label>
                <Input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            )}

            {/* Antecedência de prazos */}
            {settings.goalDeadlines && (
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Avisar com Antecedência
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.daysBeforeDeadline}
                    onChange={(e) => handleDaysChange(Number.parseInt(e.target.value) || 3)}
                    className="max-w-xs"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    dias antes do prazo
                  </span>
                </div>
              </div>
            )}

            {/* Botão de teste */}
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <Button
                onClick={sendTestNotification}
                variant="outline"
                className="w-full"
              >
                <Bell className="h-4 w-4 mr-2" />
                Enviar Notificação de Teste
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
