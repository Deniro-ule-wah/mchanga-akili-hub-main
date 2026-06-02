import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { flushQueue, getQueue } from "@/lib/api";
import { Wifi, WifiOff, CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/mchanga-afya-icon.png.asset.json";
import bannerAsset from "@/assets/mchanga-afya-logo.png.asset.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const refresh = () => setQueueCount(getQueue().length);
    refresh();
    const onOnline = () => { setOnline(true); flushQueue().then(refresh); };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    const t = setInterval(refresh, 3000);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      clearInterval(t);
    };
  }, []);

  const nav = [
    { to: "/", label: "Dashboard" },
    { to: "/farmers", label: "Farmers" },
    { to: "/farms", label: "Farms" },
    { to: "/soil-tests/new", label: "Soil Test" },
    { to: "/crop-cycles/new", label: "Crop Cycle" },
    { to: "/fertilizer/new", label: "Fertilizer" },
    { to: "/yield/new", label: "Yield" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-primary">
            <span className="grid place-items-center h-8 w-8 rounded-md bg-primary/10 overflow-hidden">
              <img src={logoAsset.url} alt="Mchanga Afya logo" className="h-8 w-8 object-contain" />
            </span>
            <span className="text-lg leading-none">Mchanga Afya</span>
          </Link>
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium",
                online ? "bg-success/15 text-success" : "bg-warning/20 text-warning-foreground",
              )}
            >
              {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              {online ? "Online" : "Offline"}
            </span>
            {queueCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-earth/15 text-earth px-2.5 py-1 font-medium">
                <CloudUpload className="h-3.5 w-3.5" />
                {queueCount} queued
              </span>
            )}
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-2 overflow-x-auto">
          <ul className="flex gap-1 pb-2">
            {nav.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    className={cn(
                      "inline-block whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <section className="mx-auto w-full max-w-6xl px-4 py-4">
        <Carousel className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <CarouselContent className="flex">
            <CarouselItem>
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={bannerAsset.url}
                  alt="Mchanga Afya banner"
                  className="h-52 w-full object-cover sm:h-64"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/10 to-slate-950/0" />
                <div className="absolute inset-x-0 bottom-4 px-4 sm:px-6">
                  <div className="rounded-2xl bg-background/80 p-4 shadow-lg shadow-slate-950/10 backdrop-blur">
                    <h2 className="text-lg font-display font-bold text-slate-950">Mchanga Afya</h2>
                    <p className="text-sm text-slate-600 sm:text-base">
                      Field-ready crop, soil, and fertilizer intelligence — now with a fresh brand banner on every page.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative overflow-hidden rounded-3xl bg-primary/5">
                <div className="flex h-52 w-full items-center justify-center px-6 sm:h-64">
                  <div className="grid gap-3 text-center">
                    <img src={logoAsset.url} alt="Mchanga Afya icon" className="mx-auto h-16 w-16 rounded-2xl bg-white/90 p-3 shadow" />
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Mchanga Afya</p>
                      <p className="text-base text-slate-700 sm:text-lg">
                        Simple data capture for farmers, farms, and soil health.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Mchanga Afya · Soil → Crop → Fertilizer → Yield
      </footer>
    </div>
  );
}
