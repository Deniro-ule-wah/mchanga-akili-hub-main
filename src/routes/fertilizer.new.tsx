import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Beaker } from "lucide-react";

import { PageHeader, FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { FERTILIZER_TYPES, APPLICATION_STAGES } from "@/lib/options";

const schema = z.object({
  crop_cycle_id: z.string().trim().min(1, "Crop cycle ID is required"),
  fertilizer_type: z.string().min(1, "Select fertilizer type"),
  quantity_kg: z.number().positive("Quantity must be > 0").max(100000),
  applied_at: z.string().min(1, "Application date is required"),
  application_stage: z.enum(["basal", "top_dressing_1", "top_dressing_2", "foliar"]),
});

export const Route = createFileRoute("/fertilizer/new")({
  head: () => ({ meta: [{ title: "Fertilizer Application — Mchanga Afya" }] }),
  component: NewFertilizer,
});

function NewFertilizer() {
  const navigate = useNavigate();
  const [f, setF] = useState({
    crop_cycle_id: "", fertilizer_type: "", quantity_kg: "",
    applied_at: new Date().toISOString().slice(0, 10), application_stage: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...f, quantity_kg: parseFloat(f.quantity_kg) });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    const res = await api.createFertilizerApplication(parsed.data);
    setSubmitting(false);
    toast.success(res.queued ? "Saved offline — will sync" : "Application logged");
    navigate({ to: "/" });
  };

  return (
    <div className="max-w-2xl">
      <PageHeader icon={Beaker} title="Fertilizer Application" subtitle="Must link to an existing crop cycle." />
      <form onSubmit={submit} className="space-y-5">
        <FormSection title="Application">
          <div>
            <Label htmlFor="cc">Crop Cycle ID *</Label>
            <Input id="cc" value={f.crop_cycle_id} onChange={(e) => setF({ ...f, crop_cycle_id: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Fertilizer type *</Label>
              <Select value={f.fertilizer_type} onValueChange={(v) => setF({ ...f, fertilizer_type: v })}>
                <SelectTrigger><SelectValue placeholder="Select fertilizer" /></SelectTrigger>
                <SelectContent>
                  {FERTILIZER_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="qty">Quantity (kg) *</Label>
              <Input id="qty" type="number" step="0.1" min="0.1" value={f.quantity_kg} onChange={(e) => setF({ ...f, quantity_kg: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Applied on *</Label>
              <Input id="date" type="date" value={f.applied_at} onChange={(e) => setF({ ...f, applied_at: e.target.value })} />
            </div>
            <div>
              <Label>Stage *</Label>
              <Select value={f.application_stage} onValueChange={(v) => setF({ ...f, application_stage: v })}>
                <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                <SelectContent>
                  {APPLICATION_STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormSection>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Log Application"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
