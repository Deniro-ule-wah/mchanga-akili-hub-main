import { cn } from "@/lib/utils";

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-5 shadow-sm space-y-4", className)}>
      <header>
        <h2 className="text-base font-display font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {Icon && (
        <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
