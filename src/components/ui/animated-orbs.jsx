export default function AnimatedOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {/* Large top-left orb */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)", animationDuration: "6s" }}
      />
      {/* Top-right orb */}
      <div
        className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-8 blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)", animationDuration: "8s", animationDelay: "2s" }}
      />
      {/* Bottom-center orb */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-10 dark:opacity-8 blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, #6d28d9, transparent 70%)", animationDuration: "10s", animationDelay: "4s" }}
      />
    </div>
  );
}
