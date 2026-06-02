import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGPS } from "@/lib/gps";
import type { GPS } from "@/lib/api";
import { MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function GpsCapture({
  value,
  onChange,
  required = true,
}: {
  value?: GPS;
  onChange: (g: GPS) => void;
  required?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    setLoading(true);
    try {
      const gps = await getGPS();
      onChange(gps);
      toast.success("GPS captured");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          GPS location {required && <span className="text-destructive">*</span>}
        </Label>
        <Button type="button" size="sm" variant="outline" onClick={capture} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : value ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          {value ? "Re-capture" : "Capture"}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Latitude</Label>
          <Input
            type="number"
            step="0.000001"
            value={value?.latitude ?? ""}
            onChange={(e) =>
              onChange({
                latitude: parseFloat(e.target.value),
                longitude: value?.longitude ?? 0,
                accuracy: value?.accuracy,
              })
            }
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Longitude</Label>
          <Input
            type="number"
            step="0.000001"
            value={value?.longitude ?? ""}
            onChange={(e) =>
              onChange({
                latitude: value?.latitude ?? 0,
                longitude: parseFloat(e.target.value),
                accuracy: value?.accuracy,
              })
            }
          />
        </div>
      </div>
      {value?.accuracy != null && (
        <p className="text-xs text-muted-foreground">±{Math.round(value.accuracy)} m accuracy</p>
      )}
    </div>
  );
}
