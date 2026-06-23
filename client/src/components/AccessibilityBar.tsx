import { useState, useEffect } from "react";
import { Accessibility, Sun, Type, Volume2, VolumeX, ZoomIn, ZoomOut, X } from "lucide-react";

export function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem("ceres-hc") === "1");
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("ceres-fs") ?? 100));
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
    localStorage.setItem("ceres-hc", highContrast ? "1" : "0");
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem("ceres-fs", String(fontSize));
  }, [fontSize]);

  const speak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.body.innerText.slice(0, 500);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const changeFontSize = (delta: number) => {
    setFontSize(prev => Math.min(140, Math.max(80, prev + delta)));
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        data-testid="button-accessibility-toggle"
        aria-label="Acessibilidade"
        className="fixed bottom-24 left-5 z-50 w-11 h-11 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 flex items-center justify-center transition-all"
        title="Opções de Acessibilidade"
      >
        <Accessibility className="w-5 h-5" />
      </button>

      {/* Panel */}
      {open && (
        <div
          data-testid="panel-accessibility"
          className="fixed bottom-40 left-5 z-50 bg-card border border-border/50 rounded-2xl shadow-2xl p-4 w-64"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-foreground">Acessibilidade</h3>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* High Contrast */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
              <div className="flex items-center gap-2 text-sm">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Alto Contraste</span>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                data-testid="button-high-contrast"
                className={`w-10 h-5 rounded-full transition-all relative ${highContrast ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${highContrast ? "left-5.5" : "left-0.5"}`} style={{ left: highContrast ? "22px" : "2px" }} />
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
              <div className="flex items-center gap-2 text-sm">
                <Type className="w-4 h-4 text-blue-500" />
                <span>Fonte ({fontSize}%)</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeFontSize(-10)}
                  data-testid="button-font-decrease"
                  className="w-7 h-7 rounded-lg bg-card border border-border/50 flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => changeFontSize(10)}
                  data-testid="button-font-increase"
                  className="w-7 h-7 rounded-lg bg-card border border-border/50 flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Voice Reading */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
              <div className="flex items-center gap-2 text-sm">
                {speaking ? <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                <span>{speaking ? "Lendo..." : "Leitura por Voz"}</span>
              </div>
              <button
                onClick={speak}
                data-testid="button-voice-reading"
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  speaking ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                {speaking ? "Parar" : "Iniciar"}
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setHighContrast(false); setFontSize(100); window.speechSynthesis.cancel(); setSpeaking(false); }}
              data-testid="button-accessibility-reset"
              className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border/50 rounded-xl"
            >
              Restaurar Padrão
            </button>
          </div>
        </div>
      )}
    </>
  );
}
