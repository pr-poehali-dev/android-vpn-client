import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
type Protocol = 'wireguard' | 'openvpn' | 'ikev2';

interface Server {
  id: string;
  country: string;
  city: string;
  flag: string;
  ping: number;
}

const servers: Server[] = [
  { id: '1', country: 'США', city: 'Нью-Йорк', flag: '🇺🇸', ping: 45 },
  { id: '2', country: 'Германия', city: 'Берлин', flag: '🇩🇪', ping: 32 },
  { id: '3', country: 'Великобритания', city: 'Лондон', flag: '🇬🇧', ping: 28 },
  { id: '4', country: 'Япония', city: 'Токио', flag: '🇯🇵', ping: 120 },
  { id: '5', country: 'Сингапур', city: 'Сингапур', flag: '🇸🇬', ping: 85 },
  { id: '6', country: 'Канада', city: 'Торонто', flag: '🇨🇦', ping: 55 },
  { id: '7', country: 'Франция', city: 'Париж', flag: '🇫🇷', ping: 38 },
  { id: '8', country: 'Нидерланды', city: 'Амстердам', flag: '🇳🇱', ping: 25 },
];

const protocols: { value: Protocol; label: string; description: string }[] = [
  { value: 'wireguard', label: 'WireGuard', description: 'Быстрый и современный' },
  { value: 'openvpn', label: 'OpenVPN', description: 'Надежный и безопасный' },
  { value: 'ikev2', label: 'IKEv2', description: 'Стабильный на мобильных' },
];

export default function Index() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [selectedServer, setSelectedServer] = useState<Server>(servers[0]);
  const [protocol, setProtocol] = useState<Protocol>('wireguard');

  const handleConnect = () => {
    if (status === 'disconnected') {
      setStatus('connecting');
      setTimeout(() => setStatus('connected'), 2000);
    } else if (status === 'connected') {
      setStatus('disconnected');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-secondary';
      case 'connecting':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Подключено';
      case 'connecting':
        return 'Подключение...';
      default:
        return 'Отключено';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Icon name="Shield" className="text-primary-foreground" size={24} />
          </div>
          <h1 className="text-xl font-bold">SecureVPN</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icon name="Settings" size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Настройки протокола</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {protocols.map((p) => (
                <Card
                  key={p.value}
                  className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                    protocol === p.value ? 'border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => setProtocol(p.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{p.label}</h3>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    </div>
                    {protocol === p.value && (
                      <Icon name="Check" className="text-primary" size={20} />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <div className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            {status === 'connected' && (
              <div className="text-xs text-muted-foreground">
                {selectedServer.flag} {selectedServer.country} • {protocol.toUpperCase()}
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            {status === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border-4 border-primary/20 animate-pulse-ring" />
              </div>
            )}
            {status === 'connected' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border-4 border-secondary/30" />
              </div>
            )}
            <Button
              size="icon"
              onClick={handleConnect}
              disabled={status === 'connecting'}
              className={`w-48 h-48 rounded-full shadow-2xl transition-all duration-300 ${
                status === 'connected'
                  ? 'bg-secondary hover:bg-secondary/90'
                  : 'bg-primary hover:bg-primary/90'
              } ${status === 'connecting' ? 'animate-pulse' : ''}`}
            >
              <Icon
                name={status === 'connected' ? 'Power' : 'Power'}
                size={64}
                className="text-white"
              />
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Card className="p-4 cursor-pointer hover:bg-accent transition-colors animate-scale-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedServer.flag}</div>
                    <div>
                      <div className="font-semibold">{selectedServer.country}</div>
                      <div className="text-sm text-muted-foreground">{selectedServer.city}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {selectedServer.ping}ms
                    </Badge>
                    <Icon name="ChevronRight" size={20} />
                  </div>
                </div>
              </Card>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Выбрать сервер</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {servers.map((server) => (
                  <Card
                    key={server.id}
                    className={`p-4 cursor-pointer transition-all hover:bg-accent ${
                      selectedServer.id === server.id ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedServer(server)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{server.flag}</div>
                        <div>
                          <div className="font-semibold">{server.country}</div>
                          <div className="text-sm text-muted-foreground">{server.city}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={
                            server.ping < 50
                              ? 'bg-green-500/20 text-green-400'
                              : server.ping < 100
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }
                        >
                          {server.ping}ms
                        </Badge>
                        {selectedServer.id === server.id && (
                          <Icon name="Check" className="text-primary" size={20} />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur border-t border-border">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">125ms</div>
            <div className="text-xs text-muted-foreground">Ping</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">256-bit</div>
            <div className="text-xs text-muted-foreground">Шифрование</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
