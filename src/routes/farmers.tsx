import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Trash2, Edit2, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/FormSection";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { confirmFarmer, rejectFarmer } from "@/api/farmers";
import { isAdminAuthenticated } from "@/lib/auth";
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

  const isAdmin = isAdminAuthenticated();

  const handleConfirm = async (farmer_id: string | number) => {
    const result = await confirmFarmer(farmer_id);
    if (result.ok) {
      toast.success(result.queued ? "Confirmed offline" : "Farmer confirmed");
      setFarmers((current) =>
        current.map((farmer) =>
          farmer.farmer_id === farmer_id ? { ...farmer, status: "confirmed" } : farmer,
        ),
      );
    } else {
      toast.error("Unable to confirm farmer");
    }
  };

  const handleReject = async (farmer_id: string | number) => {
    if (!confirm("Reject this entry and delete the farmer?")) return;
    const result = await rejectFarmer(farmer_id);
    if (result.ok) {
      toast.success(result.queued ? "Rejected offline" : "Farmer rejected");
      setFarmers((current) => current.filter((farmer) => farmer.farmer_id !== farmer_id));
    } else {
      toast.error("Unable to reject farmer");
    }
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
        <Link
          to="/farmers/new"
          className={cn(buttonVariants({ variant: "default", size: "default" }))}
        >
          Add Farmer
        </Link>
      </div>

        {!isAdmin && (
          <div className="rounded-lg border border-border bg-secondary/10 p-4 mb-5 text-sm text-secondary-foreground">
            Admin login is required to confirm or reject farmers. 
            <Link to="/admin" className="font-semibold underline">
              Sign in as admin
            </Link>
          </div>
        )}

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
          <Link
            to="/farmers/new"
            className={cn(buttonVariants({ variant: "default", size: "default" }))}
          >
            Register First Farmer
          </Link>
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
                <TableHead>Status</TableHead>
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
                  <TableCell>
                    <Badge variant={farmer.status === "confirmed" ? "default" : "secondary"}>
                      {farmer.status === "confirmed" ? "Confirmed" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>{farmer.email || "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {isAdmin && farmer.status !== "confirmed" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-success hover:text-success"
                          onClick={() => handleConfirm(farmer.farmer_id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleReject(farmer.farmer_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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
