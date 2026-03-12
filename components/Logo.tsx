export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      GRUPO <span className="text-accent">+</span>351
    </span>
  );
}
