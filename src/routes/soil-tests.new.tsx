import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { FlaskConical } from "lucide-react";

import { PageHeader, FormSection } from "@/components/FormSection";
import { GpsCapture } from "@/components/GpsCapture";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api, type GPS } from "@/lib/api";
import { TEXTURE_OPTIONS } from "@/lib/options";

const schema = z.object({
  farm_id: z.string().trim().min(1, "Farm ID is required"),
  sampled_at: z.string().min(1, "Sampling date is required"),
  ph: z.number().min(3.5, "pH must be ≥ 3.5").max(9.0, "pH must be ≤ 9.0"),
  nitrogen_ppm: z.number().min(0).max(2000),
  phosphorus_ppm: z.number().min(0).max(2000),
  potassium_ppm: z.number().min(0).max(5000),
  organic_carbon_pct: z.number().min(0).max(15),
  texture: z.enum(["sand", "loam", "clay", "silt", "sandy_loam", "clay_loam"]),
  zinc_ppm: z.number().min(0).max(500).optional(),
  boron_ppm: z.number().min(0).max(100).optional(),
});

const num = (v: string) => (v === "" ? NaN : parseFloat(v));

export const Route = createFileRoute("/soil-tests/new")({
  head: () => ({ meta: [{ title: "Soil Test — Mchanga Afya" }] }),
  component: NewSoilTest,
});

function NewSoilTest() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    farm_id: "", sampled_at: new Date().toISOString().slice(0, 10),
    ph: "", nitrogen_ppm: "", phosphorus_ppm: "", potassium_ppm: "",
    organic_carbon_pct: "", texture: "", zinc_ppm: "", boron_ppm: "",
  });
  const [gps, setGps] = useState<GPS | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      farm_id: f.farm_id,
      sampled_at: f.sampled_at,
      ph: num(f.ph),
      nitrogen_ppm: num(f.nitrogen_ppm),
      phosphorus_ppm: num(f.phosphorus_ppm),
      potassium_ppm: num(f.potassium_ppm),
      organic_carbon_pct: num(f.organic_carbon_pct),
      texture: f.texture,
      zinc_ppm: f.zinc_ppm ? num(f.zinc_ppm) : undefined,
      boron_ppm: f.boron_ppm ? num(f.boron_ppm) : undefined,
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    if (!gps) { toast.error("GPS location is required"); return; }
    setSubmitting(true);
    const res = await api.createSoilTest({ ...parsed.data, gps });
    setSubmitting(false);
    toast.success(res.queued ? "Saved offline — will sync" : "Soil test recorded");
    navigate({ to: "/" });
  };

  const numField = (key: keyof typeof f, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} type="number" value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })} {...props} />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <PageHeader icon={FlaskConical} title="Soil Test" subtitle="Structured nutrient profile — numeric values only." />
      <form onSubmit={submit} className="space-y-5">
        <FormSection title="Sample">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="farm_id">Farm ID *</Label>
              <Input id="farm_id" value={f.farm_id} onChange={(e) => setF({ ...f, farm_id: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="sampled_at">Sampled date *</Label>
              <Input id="sampled_at" type="date" value={f.sampled_at} onChange={(e) => setF({ ...f, sampled_at: e.target.value })} />
            </div>
          </div>
        </FormSection>

        <FormSection title="Macronutrients & pH" description="pH must be between 3.5 and 9.0.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {numField("ph", "pH *", { step: "0.1", min: "3.5", max: "9.0" })}
            {numField("nitrogen_ppm", "N (ppm) *", { step: "0.1", min: "0" })}
            {numField("phosphorus_ppm", "P (ppm) *", { step: "0.1", min: "0" })}
            {numField("potassium_ppm", "K (ppm) *", { step: "0.1", min: "0" })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {numField("organic_carbon_pct", "Organic C (%) *", { step: "0.01", min: "0", max: "15" })}
            {numField("zinc_ppm", "Zn (ppm)", { step: "0.01", min: "0" })}
            {numField("boron_ppm", "B (ppm)", { step: "0.01", min: "0" })}
            <div>
              <Label>Texture *</Label>
              <Select value={f.texture} onValueChange={(v) => setF({ ...f, texture: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {TEXTURE_OPTIONS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormSection>

        <FormSection title="Sampling location">
          <GpsCapture value={gps} onChange={setGps} />
        </FormSection>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save Soil Test"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
