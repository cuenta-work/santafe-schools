export interface LatLon {
  lat: number;
  lon: number;
}

// Radios más amplios que un mapa de una sola ciudad: acá los resultados
// están repartidos por toda la provincia, así que "cerca tuyo" tiene que
// poder significar tanto "a 10 cuadras" como "en el pueblo de al lado".
export const RADII = [
  { km: 3, label: "3 km" },
  { km: 10, label: "10 km" },
  { km: 30, label: "30 km" },
  { km: 100, label: "100 km" },
] as const;

export function distanceKm(a: LatLon, b: LatLon): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `a ${Math.round(km * 1000)} m`;
  return `a ${km.toFixed(1)} km`;
}
