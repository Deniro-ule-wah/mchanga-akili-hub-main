import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Wheat } from "lucide-react";

import { PageHeader, FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { CROP_TYPES } from "@/lib/options";

const schema = z.object({
  farm_id: z.string().trim().min(1, "Farm ID is required"),
  crop_type: z.string().min(1, "Select crop type"),
  seed_variety: z.string().trim().min(1, "Seed variety is required").max(120),
  planting_date: z.string().min(1, "Planting date is required"),
  expected_harvest_date: z.string().min(1, "Expected harvest date is required"),
  area_hectares: z.number().positive("Area must be > 0").max(10000),
}).refine((d) => d.expected_harvest_date > d.planting_date, {
  message: "Harvest date must be after planting date",
  path: ["expected_harvest_date"],
});

export const Route = createFileRoute("/crop-cycles/new")({
  head: () => ({ meta: [{ title: "Crop Cycle — Mchanga Afya" }] }),
  component: NewCropCycle,
});

function NewCropCycle() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    farm_id: "", crop_type: "", seed_variety: "",
    planting_date: "", expected_harvest_date: "", area_hectares: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...f, area_hectares: parseFloat(f.area_hectares) });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    const res = await api.createCropCycle(parsed.data);
    setSubmitting(false);
    toast.success(res.queued ? "Saved offline — will sync" : "Crop cycle recorded");
    navigate({ to: "/" });
  };

  return (
    <div className="max-w-2xl">
      <PageHeader icon={Wheat} title="Crop Cycle" subtitle="Plant a new crop on a registered farm." />
      <form onSubmit={submit} className="space-y-5">
        <FormSection title="Crop">
          <div>
            <Label htmlFor="farm_id">Farm ID *</Label>
            <Input id="farm_id" value={f.farm_id} onChange={(e) => setF({ ...f, farm_id: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Crop type *</Label>
              <Select value={f.crop_type} onValueChange={(v) => setF({ ...f, crop_type: v })}>
                <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                <SelectContent>
                  {CROP_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="variety">Seed variety *</Label>
              <Input id="variety" value={f.seed_variety} onChange={(e) => setF({ ...f, seed_variety: e.target.value })} placeholder="e.g. H614" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="plant">Planting date *</Label>
              <Input id="plant" type="date" value={f.planting_date} onChange={(e) => setF({ ...f, planting_date: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="harv">Expected harvest *</Label>
              <Input id="harv" type="date" value={f.expected_harvest_date} onChange={(e) => setF({ ...f, expected_harvest_date: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="area">Area (ha) *</Label>
              <Input id="area" type="number" step="0.01" min="0.01" value={f.area_hectares} onChange={(e) => setF({ ...f, area_hectares: e.target.value })} />
            </div>
          </div>
        </FormSection>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save Crop Cycle"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
