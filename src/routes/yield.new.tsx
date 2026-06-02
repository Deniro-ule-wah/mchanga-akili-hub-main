import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { BarChart3 } from "lucide-react";

import { PageHeader, FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { QUALITY_GRADES } from "@/lib/options";

const schema = z.object({
  crop_cycle_id: z.string().trim().min(1, "Crop cycle ID is required"),
  harvest_date: z.string().min(1, "Harvest date is required"),
  total_yield_kg: z.number().nonnegative("Yield must be ≥ 0").max(10_000_000),
  quality_grade: z.enum(["A", "B", "C"]),
  moisture_pct: z.number().min(0).max(100).optional(),
});

export const Route = createFileRoute("/yield/new")({
  head: () => ({ meta: [{ title: "Yield Outcome — Mchanga Afya" }] }),
  component: NewYield,
});

function NewYield() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    crop_cycle_id: "", harvest_date: new Date().toISOString().slice(0, 10),
    total_yield_kg: "", quality_grade: "", moisture_pct: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      crop_cycle_id: f.crop_cycle_id,
      harvest_date: f.harvest_date,
      total_yield_kg: parseFloat(f.total_yield_kg),
      quality_grade: f.quality_grade,
      moisture_pct: f.moisture_pct ? parseFloat(f.moisture_pct) : undefined,
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    const res = await api.createYieldOutcome(parsed.data);
    setSubmitting(false);
    toast.success(res.queued ? "Saved offline — will sync" : "Yield recorded");
    navigate({ to: "/" });
  };

  return (
    <div className="max-w-2xl">
      <PageHeader icon={BarChart3} title="Yield Outcome" subtitle="Closes the loop: links back to the crop cycle." />
      <form onSubmit={submit} className="space-y-5">
        <FormSection title="Harvest">
          <div>
            <Label htmlFor="cc">Crop Cycle ID *</Label>
            <Input id="cc" value={f.crop_cycle_id} onChange={(e) => setF({ ...f, crop_cycle_id: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Harvest date *</Label>
              <Input id="date" type="date" value={f.harvest_date} onChange={(e) => setF({ ...f, harvest_date: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="yield">Total yield (kg) *</Label>
              <Input id="yield" type="number" step="0.1" min="0" value={f.total_yield_kg} onChange={(e) => setF({ ...f, total_yield_kg: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Quality grade *</Label>
              <Select value={f.quality_grade} onValueChange={(v) => setF({ ...f, quality_grade: v })}>
                <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                <SelectContent>
                  {QUALITY_GRADES.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="moist">Moisture (%)</Label>
              <Input id="moist" type="number" step="0.1" min="0" max="100" value={f.moisture_pct} onChange={(e) => setF({ ...f, moisture_pct: e.target.value })} />
            </div>
          </div>
        </FormSection>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save Yield"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
