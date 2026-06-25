import * as React from "react";
import { Bell, Link2, ShieldCheck, Smile, SunMedium } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/Button";

const STORAGE_KEY = "ceres-settings";

const defaultSettings = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  bio: "",
  avatar: "",
};

type SettingsState = typeof defaultSettings;

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("perfil");
  const [settings, setSettings] = React.useState<SettingsState>(defaultSettings);
  const [isSaving, setIsSaving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const handleInputChange = (key: keyof SettingsState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSettings((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSelectPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result as string;
      setSettings((current) => ({ ...current, avatar: image }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSettings((current) => ({ ...current, avatar: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast({
        title: "Configurações salvas",
        description: "Seus dados foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível armazenar suas configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-card border border-border/50 p-8 shadow-sm">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Gerencie sua conta, notificações, segurança e integrações em um só lugar.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border/50 p-6 shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 p-1 bg-muted rounded-2xl">
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
              <TabsTrigger value="aparencia">Aparência</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
              <TabsTrigger value="integracoes">Integrações</TabsTrigger>
            </TabsList>

            <TabsContent value="perfil" className="mt-6">
              <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
                <section className="rounded-3xl border border-border/50 bg-background p-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Avatar className="h-28 w-28">
                      {settings.avatar ? (
                        <AvatarImage src={settings.avatar} alt="Foto de perfil" />
                      ) : (
                        <AvatarFallback>
                          <span className="text-xl font-semibold text-foreground">
                            {settings.firstName?.[0] ?? "U"}
                            {settings.lastName?.[0] ?? "S"}
                          </span>
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold text-foreground">Foto de perfil</p>
                      <p className="text-sm text-muted-foreground">Atualize sua imagem pessoal</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleSelectPhoto}>
                      Alterar foto
                    </Button>
                    <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={handleRemovePhoto}>
                      Remover
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </section>

                <section className="rounded-3xl border border-border/50 bg-background p-6 space-y-5">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Informações pessoais</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Atualize seus dados de contato e descrição profissional.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        value={settings.firstName}
                        onChange={handleInputChange("firstName")}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        value={settings.lastName}
                        onChange={handleInputChange("lastName")}
                        placeholder="Seu sobrenome"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={handleInputChange("email")}
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="role">Cargo</Label>
                      <Input
                        id="role"
                        value={settings.role}
                        onChange={handleInputChange("role")}
                        placeholder="Ex: Analista Ambiental"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={settings.bio}
                        onChange={handleInputChange("bio")}
                        placeholder="Escreva algo sobre sua função e experiência"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="button" onClick={handleSave} isLoading={isSaving}>
                  Salvar alterações
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notificacoes" className="mt-6">
              <div className="grid gap-6">
                <div className="rounded-3xl border border-border/50 bg-background p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Bell className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Notificações</h2>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Defina como você prefere receber alertas de eventos, novas integrações e atualizações do sistema.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/50 bg-background p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emailAlerts">Alertas por e-mail</Label>
                      <Input id="emailAlerts" placeholder="Ativado" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pushAlerts">Alertas por app</Label>
                      <Input id="pushAlerts" placeholder="Ativado" disabled />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="aparencia" className="mt-6">
              <div className="grid gap-6">
                <div className="rounded-3xl border border-border/50 bg-background p-6">
                  <div className="flex items-center gap-3 text-foreground">
                    <SunMedium className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Aparência</h2>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Ajuste o tema e o estilo de visualização para combinar com seu modo de trabalho.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/50 bg-background p-6 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="themeMode">Tema</Label>
                      <Input id="themeMode" placeholder="Automático" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="textSize">Tamanho do texto</Label>
                      <Input id="textSize" placeholder="Padrão" disabled />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seguranca" className="mt-6">
              <div className="grid gap-6">
                <div className="rounded-3xl border border-border/50 bg-background p-6">
                  <div className="flex items-center gap-3 text-foreground">
                    <ShieldCheck className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Segurança</h2>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Atualize seu acesso, autenticação e dispositivos confiáveis.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/50 bg-background p-6 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" type="password" placeholder="••••••••" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twoFactor">Autenticação 2FA</Label>
                      <Input id="twoFactor" placeholder="Ativada" disabled />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integracoes" className="mt-6">
              <div className="grid gap-6">
                <div className="rounded-3xl border border-border/50 bg-background p-6">
                  <div className="flex items-center gap-3 text-foreground">
                    <Link2 className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Integrações</h2>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Conecte serviços e APIs para automatizar seu fluxo de trabalho ambiental.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/50 bg-background p-6 space-y-4">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="rounded-2xl border border-border/50 bg-muted/50 p-4">
                      Google Drive - Conectado
                    </li>
                    <li className="rounded-2xl border border-border/50 bg-muted/50 p-4">
                      API de Sensores - Configurada
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
