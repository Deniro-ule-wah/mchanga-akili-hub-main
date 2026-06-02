import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import { PageHeader, FormSection } from "@/components/FormSection";
import { GpsCapture } from "@/components/GpsCapture";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api, type GPS } from "@/lib/api";
import { COUNTIES } from "@/lib/options";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  phone: z.string().trim().regex(/^\+?\d{9,15}$/, "Use 9–15 digits, optional + prefix"),
  national_id: z.string().trim().max(20).optional().or(z.literal("")),
  county: z.string().min(1, "Select a county"),
  village: z.string().trim().min(2, "Village is required").max(120),
});

export const Route = createFileRoute("/farmers/new")({
  head: () => ({ meta: [{ title: "Add Farmer — Mchanga Afya" }] }),
  component: NewFarmer,
});

function NewFarmer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", national_id: "", county: "", village: "" });
  const [gps, setGps] = useState<GPS | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!gps || !Number.isFinite(gps.latitude) || !Number.isFinite(gps.longitude)) {
      toast.error("GPS location is required");
      return;
    }
    setSubmitting(true);
    const res = await api.createFarmer({ ...parsed.data, gps });
    setSubmitting(false);
    toast.success(res.queued ? "Saved offline — will sync" : "Farmer registered");
    navigate({ to: "/" });
  };

  return (
    <div className="max-w-2xl">
      <PageHeader icon={UserPlus} title="Register Farmer" subtitle="Capture identity and primary location." />
      <form onSubmit={submit} className="space-y-5">
        <FormSection title="Identity">
          <div>
            <Label htmlFor="name">Full name *</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" inputMode="tel" placeholder="+2547..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="nid">National ID</Label>
              <Input id="nid" value={form.national_id} onChange={(e) => setForm({ ...form, national_id: e.target.value })} />
            </div>
          </div>
        </FormSection>

        <FormSection title="Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>County *</Label>
              <Select value={form.county} onValueChange={(v) => setForm({ ...form, county: v })}>
                <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                <SelectContent>
                  {COUNTIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="village">Village *</Label>
              <Input id="village" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} />
            </div>
          </div>
          <GpsCapture value={gps} onChange={setGps} />
        </FormSection>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Register Farmer"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
