import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Trash2, Edit2 } from "lucide-react";

import { PageHeader } from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, type Farmer } from "@/lib/api";

export const Route = createFileRoute("/farmers")({
  head: () => ({ meta: [{ title: "Farmers — Mchanga Afya" }] }),
  component: FarmersList,
});

function FarmersList() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    setLoading(true);
    setError(null);
    const result = await api.getFarmers();
    if (result.ok) {
      setFarmers(result.data);
    } else {
      setError("Unable to load farmers");
      toast.error("Failed to load farmers");
    }
    setLoading(false);
  };

  const handleDelete = async (farmer_id: string | number) => {
    if (!confirm("Are you sure you want to delete this farmer?")) return;
    const result = await api.deleteFarmer(farmer_id);
    if (result.ok) {
      toast.success(result.queued ? "Farmer deleted (offline)" : "Farmer deleted");
      setFarmers(farmers.filter((f) => f.farmer_id !== farmer_id));
    } else {
      toast.error("Failed to delete farmer");
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-5">
        <PageHeader icon={Users} title="Farmers" subtitle="Registered field agents and farm operators." />
        <Button asChild>
          <Link to="/farmers/new">Add Farmer</Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Loading farmers...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : farmers.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">No farmers registered yet.</p>
          <Button asChild>
            <Link to="/farmers/new">Register First Farmer</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>County</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farmers.map((farmer) => (
                <TableRow key={farmer.farmer_id}>
                  <TableCell className="font-medium">{farmer.full_name}</TableCell>
                  <TableCell>{farmer.phone}</TableCell>
                  <TableCell>{farmer.county || "—"}</TableCell>
                  <TableCell>{farmer.village || "—"}</TableCell>
                  <TableCell>{farmer.email || "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/farmers/${farmer.farmer_id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(farmer.farmer_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
