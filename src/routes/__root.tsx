import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";
import { Toaster } from "@/components/ui/sonner";
import faviconAsset from "@/assets/mchanga-afya-icon.png.asset.json";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mchanga Afya — Soil & Crop Intelligence" },
      {
        name: "description",
        content:
          "Field data capture for soil health, crop cycles, fertilizer application and yield outcomes across East Africa.",
      },
      { property: "og:title", content: "Mchanga Afya — Soil & Crop Intelligence" },
      { name: "twitter:title", content: "Mchanga Afya — Soil & Crop Intelligence" },
      { name: "description", content: "Mchanga Afya is a soil intelligent platform that enables farmers to apply right fertiliser nutrients on their farms based on their area, and soil type" },
      { property: "og:description", content: "Mchanga Afya is a soil intelligent platform that enables farmers to apply right fertiliser nutrients on their farms based on their area, and soil type" },
      { name: "twitter:description", content: "Mchanga Afya is a soil intelligent platform that enables farmers to apply right fertiliser nutrients on their farms based on their area, and soil type" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/J0nmhg8qJ3Zm1bJYJ8eMzSuRhh42/social-images/social-1780387377592-Gemini_Generated_Image_lzxdg0lzxdg0lzxd.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/J0nmhg8qJ3Zm1bJYJ8eMzSuRhh42/social-images/social-1780387377592-Gemini_Generated_Image_lzxdg0lzxdg0lzxd.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: faviconAsset.url },      { rel: "shortcut icon", type: "image/png", href: faviconAsset.url },      { rel: "apple-touch-icon", href: faviconAsset.url },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <Outlet />
      </AppShell>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
