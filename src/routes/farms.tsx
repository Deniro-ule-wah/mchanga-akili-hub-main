import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sprout } from "lucide-react";

import { PageHeader } from "@/components/FormSection";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, type Farm } from "@/lib/api";

export const Route = createFileRoute("/farms")({
  head: () => ({ meta: [{ title: "Farms — Mchanga Afya" }] }),
  component: FarmsList,
});

function FarmsList() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    setError(null);
    const result = await api.getFarms();
    if (result.ok) {
      setFarms(result.data);
    } else {
      setError("Unable to load farms");
      toast.error("Failed to load farms");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-5">
        <PageHeader icon={Sprout} title="Farms" subtitle="Land parcels registered for each farmer." />
        <Link
          to="/farms/new"
          className={cn(buttonVariants({ variant: "default", size: "default" }))}
        >
          Add Farm
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Loading farms...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : farms.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">No farms registered yet.</p>
          <Link
            to="/farms/new"
            className={cn(buttonVariants({ variant: "default", size: "default" }))}
          >
            Register First Farm
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm Name</TableHead>
                <TableHead>Farmer ID</TableHead>
                <TableHead className="text-right">Size (ha)</TableHead>
                <TableHead>Soil Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farms.map((farm) => (
                <TableRow key={farm.id ?? `${farm.farmer_id}-${farm.name}`}>
                  <TableCell className="font-medium">{farm.name}</TableCell>
                  <TableCell>{farm.farmer_id}</TableCell>
                  <TableCell className="text-right">{farm.size_hectares ?? "—"}</TableCell>
                  <TableCell>{farm.soil_type || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
