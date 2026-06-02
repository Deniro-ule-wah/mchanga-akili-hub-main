import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Sprout } from "lucide-react";

import { PageHeader, FormSection } from "@/components/FormSection";
import { GpsCapture } from "@/components/GpsCapture";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api, type GPS } from "@/lib/api";
import { SOIL_TYPES } from "@/lib/options";

const schema = z.object({
  farmer_id: z.string().trim().min(1, "Farmer ID is required"),
  name: z.string().trim().min(2, "Farm name is required").max(120),
  size_hectares: z.number().positive("Size must be > 0").max(10000),
  soil_type: z.string().min(1, "Select soil type"),
});

export const Route = createFileRoute("/farms/new")({
  head: () => ({ meta: [{ title: "Add Farm — Mchanga Afya" }] }),
  component: NewFarm,
});

function NewFarm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ farmer_id: "", name: "", size_hectares: "", soil_type: "" });
  const [gps, setGps] = useState<GPS | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      ...form,
      size_hectares: parseFloat(form.size_hectares),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!gps) { toast.error("GPS location is required"); return; }
    setSubmitting(true);
    const res = await api.createFarm({ ...parsed.data, gps });
    setSubmitting(false);
    toast.success(res.queued ? "Saved offline — will sync" : "Farm registered");
    navigate({ to: "/" });
  };

  return (
    <div className="max-w-2xl">
      <PageHeader icon={Sprout} title="Register Farm" subtitle="Link land parcel to a farmer." />
      <form onSubmit={submit} className="space-y-5">
        <FormSection title="Farm details">
          <div>
            <Label htmlFor="farmer_id">Farmer ID *</Label>
            <Input id="farmer_id" value={form.farmer_id} onChange={(e) => setForm({ ...form, farmer_id: e.target.value })} placeholder="UUID from farmer record" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Farm name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="size">Size (hectares) *</Label>
              <Input id="size" type="number" step="0.01" min="0.01" value={form.size_hectares} onChange={(e) => setForm({ ...form, size_hectares: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Soil type *</Label>
            <Select value={form.soil_type} onValueChange={(v) => setForm({ ...form, soil_type: v })}>
              <SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger>
              <SelectContent>
                {SOIL_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </FormSection>

        <FormSection title="Farm centroid GPS">
          <GpsCapture value={gps} onChange={setGps} />
        </FormSection>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Register Farm"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
