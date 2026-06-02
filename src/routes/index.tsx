import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/FormSection";
import {
  UserPlus, Sprout, FlaskConical, Wheat, Beaker, BarChart3, LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getQueue, flushQueue } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Field Agent Dashboard — Mchanga Afya" },
      { name: "description", content: "Capture farmer, farm, soil, crop and yield data from the field." },
    ],
  }),
  component: Dashboard,
});

const actions = [
  { to: "/farmers/new", label: "Add Farmer", icon: UserPlus, hint: "Register a new farmer" },
  { to: "/farms/new", label: "Add Farm", icon: Sprout, hint: "Link a farm to a farmer" },
  { to: "/soil-tests/new", label: "Soil Test", icon: FlaskConical, hint: "pH, NPK, texture" },
  { to: "/crop-cycles/new", label: "Crop Cycle", icon: Wheat, hint: "Planting & variety" },
  { to: "/fertilizer/new", label: "Fertilizer", icon: Beaker, hint: "Application log" },
  { to: "/yield/new", label: "Yield", icon: BarChart3, hint: "Harvest outcome" },
];

function Dashboard() {
  const [queue, setQueue] = useState(getQueue());
  useEffect(() => {
    const t = setInterval(() => setQueue(getQueue()), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader
        icon={LayoutDashboard}
        title="Field Agent"
        subtitle="Mobile-first capture for the full soil → crop → fertilizer → yield lifecycle."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="group rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary hover:shadow-md transition-all"
          >
            <span className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <a.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-display font-semibold text-sm">{a.label}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{a.hint}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold">Offline queue</h2>
          {queue.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => flushQueue().then(() => setQueue(getQueue()))}
            >
              Sync now
            </Button>
          )}
        </div>
        {queue.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pending submissions. Captured records will queue here when offline and sync automatically when the device reconnects.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {queue.slice(-10).reverse().map((q) => (
              <li key={q.id} className="py-2 flex items-center justify-between text-sm">
                <span className="font-mono text-xs text-muted-foreground">{q.method}</span>
                <span className="flex-1 mx-3 truncate">{q.path}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(q.queuedAt).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
