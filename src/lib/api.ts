// REST API client for Mchanga Afya backend.
// Configure VITE_API_BASE_URL in your environment to point at your existing PostgreSQL-backed REST API.
// Falls back to an offline queue stored in localStorage when the network is unavailable.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";

export interface GPS {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface Farmer {
  id?: string;
  name: string;
  phone: string;
  county: string;
  village: string;
  national_id?: string;
  gps?: GPS;
}

export interface Farm {
  id?: string;
  farmer_id: string;
  name: string;
  size_hectares: number;
  soil_type: string;
  gps?: GPS;
}

export interface SoilTest {
  id?: string;
  farm_id: string;
  sampled_at: string; // ISO date
  ph: number;
  nitrogen_ppm: number;
  phosphorus_ppm: number;
  potassium_ppm: number;
  organic_carbon_pct: number;
  texture: "sand" | "loam" | "clay" | "silt" | "sandy_loam" | "clay_loam";
  zinc_ppm?: number;
  boron_ppm?: number;
  gps?: GPS;
}

export interface CropCycle {
  id?: string;
  farm_id: string;
  crop_type: string;
  seed_variety: string;
  planting_date: string;
  expected_harvest_date: string;
  area_hectares: number;
}

export interface FertilizerApplication {
  id?: string;
  crop_cycle_id: string;
  fertilizer_type: string;
  quantity_kg: number;
  applied_at: string;
  application_stage: "basal" | "top_dressing_1" | "top_dressing_2" | "foliar";
}

export interface YieldOutcome {
  id?: string;
  crop_cycle_id: string;
  harvest_date: string;
  total_yield_kg: number;
  quality_grade: "A" | "B" | "C";
  moisture_pct?: number;
}

const QUEUE_KEY = "mchanga.offline.queue.v1";

interface QueuedRequest {
  id: string;
  path: string;
  method: string;
  body: unknown;
  queuedAt: string;
}

export function getQueue(): QueuedRequest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setQueue(q: QueuedRequest[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

function enqueue(path: string, method: string, body: unknown) {
  const q = getQueue();
  q.push({
    id: crypto.randomUUID(),
    path,
    method,
    body,
    queuedAt: new Date().toISOString(),
  });
  setQueue(q);
}

export async function flushQueue(): Promise<{ flushed: number; failed: number }> {
  if (!navigator.onLine || !BASE_URL) return { flushed: 0, failed: 0 };
  const q = getQueue();
  const remaining: QueuedRequest[] = [];
  let flushed = 0;
  for (const item of q) {
    try {
      const res = await fetch(`${BASE_URL}${item.path}`, {
        method: item.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.body),
      });
      if (!res.ok) throw new Error(String(res.status));
      flushed++;
    } catch {
      remaining.push(item);
    }
  }
  setQueue(remaining);
  return { flushed, failed: remaining.length };
}

async function post<T>(path: string, body: T): Promise<{ ok: true; queued: boolean }> {
  if (!BASE_URL || !navigator.onLine) {
    enqueue(path, "POST", body);
    return { ok: true, queued: true };
  }
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ok: true, queued: false };
  } catch {
    enqueue(path, "POST", body);
    return { ok: true, queued: true };
  }
}

export const api = {
  createFarmer: (f: Farmer) => post("/farmers", f),
  createFarm: (f: Farm) => post("/farms", f),
  createSoilTest: (s: SoilTest) => post("/soil-tests", s),
  createCropCycle: (c: CropCycle) => post("/crop-cycles", c),
  createFertilizerApplication: (a: FertilizerApplication) => post("/fertilizer-applications", a),
  createYieldOutcome: (y: YieldOutcome) => post("/yield-outcomes", y),
};

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    flushQueue();
  });
}
