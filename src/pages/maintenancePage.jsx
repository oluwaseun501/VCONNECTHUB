// MaintenancePage.jsx  — shown to regular users when maintenance mode is ON
// Drop this anywhere in your frontend components folder.

export default function MaintenancePage({ message }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <span className="text-4xl">🔧</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Under Maintenance</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {message || "We're working on something. Please check back soon."}
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 pt-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-amber-400 opacity-60 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
