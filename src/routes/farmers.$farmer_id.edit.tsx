import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Edit2 } from "lucide-react";

import { PageHeader, FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api, type Farmer } from "@/lib/api";
import { COUNTIES } from "@/lib/options";

const schema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(120),
  phone: z.string().trim().regex(/^\+?\d{9,15}$/, "Use 9–15 digits, optional + prefix"),
  email: z.string().email().optional().or(z.literal("")),
  county: z.string().min(1, "Select a county"),
  village: z.string().trim().min(2, "Village is required").max(120),
  sub_county: z.string().trim().optional().or(z.literal("")),
});

export const Route = createFileRoute("/farmers/$farmer_id/edit")({
  head: () => ({ meta: [{ title: "Edit Farmer — Mchanga Afya" }] }),
  component: EditFarmer,
});

function EditFarmer() {
  const { farmer_id } = useParams({ from: "/farmers/$farmer_id/edit" });
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", county: "", village: "", sub_county: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFarmer = async () => {
      const result = await api.getFarmerById(farmer_id);
      if (result.ok && result.data) {
        setForm({
          full_name: result.data.full_name,
          phone: result.data.phone,
          email: result.data.email || "",
          county: result.data.county || "",
          village: result.data.village || "",
          sub_county: result.data.sub_county || "",
        });
      } else {
        toast.error("Failed to load farmer details");
        navigate({ to: "/farmers" });
      }
      setLoading(false);
    };
    loadFarmer();
  }, [farmer_id, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const res = await api.updateFarmer(farmer_id, parsed.data);
    setSubmitting(false);
    toast.success(res.queued ? "Saved offline — will sync" : "Farmer updated");
    navigate({ to: "/farmers" });
  };

  if (loading) {
    return <div className="max-w-2xl"><PageHeader icon={Edit2} title="Edit Farmer" subtitle="Update farmer information." /></div>;
  }

  return (
    <div className="max-w-2xl">
      <PageHeader icon={Edit2} title="Edit Farmer" subtitle="Update farmer information." />
      <form onSubmit={submit} className="space-y-5">
        <FormSection title="Identity">
          <div>
            <Label htmlFor="name">Full name *</Label>
            <Input id="name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" inputMode="tel" placeholder="+2547..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
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
              <Label htmlFor="sub_county">Sub-County</Label>
              <Input id="sub_county" value={form.sub_county} onChange={(e) => setForm({ ...form, sub_county: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="village">Village *</Label>
            <Input id="village" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} />
          </div>
        </FormSection>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Update Farmer"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/farmers" })}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
