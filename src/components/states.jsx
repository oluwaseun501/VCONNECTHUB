import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
      <p className="font-mono text-sm">INITIALIZING_UPLINK...</p>
    </div>
  );
}

export function ErrorState({ error, retry }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 border border-destructive/20 bg-destructive/5 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <div className="w-3 h-3 rounded-full bg-destructive shadow-[0_0_10px_2px_rgba(220,38,38,0.5)]" />
      </div>
      <h3 className="text-lg font-bold text-destructive mb-2">SYSTEM_FAULT</h3>
      <p className="text-muted-foreground max-w-md mb-6">{error?.message || "An unknown error occurred while communicating with the matrix."}</p>
      {retry && (
        <button 
          onClick={retry}
          className="px-4 py-2 bg-background border border-border rounded-md hover:bg-muted transition-colors font-mono text-sm"
        >
          RETRY_CONNECTION
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-xl bg-card/30">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-primary opacity-80" />
        </div>
      )}
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
