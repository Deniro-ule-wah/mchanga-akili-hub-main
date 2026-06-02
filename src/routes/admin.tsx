import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginAdmin, isAdminAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Login — Mchanga Afya" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate({ to: "/", replace: true });
    }
  }, [navigate]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (loginAdmin(username.trim(), password)) {
      toast.success("Admin signed in successfully");
      navigate({ to: "/", replace: true });
      return;
    }
    toast.error("Invalid admin credentials");
  };

  return (
    <div className="max-w-xl">
      <PageHeader
        icon={Lock}
        title="Admin Sign In"
        subtitle="Authenticate to confirm farmers and access the protected dashboard."
      />
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="admin-username">Username</Label>
            <Input
              id="admin-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit">Sign in</Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/farmers" })}>
              Browse farmers
            </Button>
          </div>
        </form>
      </div>
      <div className="mt-6 rounded-xl border border-border bg-secondary/10 p-4 text-sm text-secondary-foreground">
        Default admin credentials:
        <div className="mt-2 grid gap-2 text-xs text-muted-foreground">
          <span>Username: admin</span>
          <span>Password: admin123</span>
        </div>
      </div>
    </div>
  );
}
