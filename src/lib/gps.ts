import type { GPS } from "./api";

export function getGPS(): Promise<GPS> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported on this device"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: +pos.coords.latitude.toFixed(6),
          longitude: +pos.coords.longitude.toFixed(6),
          accuracy: pos.coords.accuracy,
        }),
      (err) => reject(new Error(err.message || "Unable to read GPS")),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  });
}
