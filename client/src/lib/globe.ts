const DEG = Math.PI / 180;

export const LAGOS = { lat: 6.5244, lon: 3.3792 };

interface ProjectedPoint {
  x: number;
  y: number;
  z: number; // depth: > 0 means facing the viewer
}

// Orthographic projection of a lat/lon point on a sphere rotated by rotationDeg
function project(
  latDeg: number,
  lonDeg: number,
  rotationDeg: number,
  radius: number,
  cx: number,
  cy: number,
): ProjectedPoint {
  const lat = latDeg * DEG;
  const lon = (lonDeg + rotationDeg) * DEG;
  return {
    x: cx + radius * Math.cos(lat) * Math.sin(lon),
    y: cy - radius * Math.sin(lat),
    z: Math.cos(lat) * Math.cos(lon),
  };
}

export function drawGlobe(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rotationDeg: number,
  pingProgress: number,
  found: boolean,
): void {
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.36;

  // Sphere outline
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(30, 45, 69, 0.9)'; // --steel
  ctx.lineWidth = 1;
  ctx.stroke();

  // Dot grid — alpha scales with depth so the sphere reads as 3D
  for (let lat = -75; lat <= 75; lat += 15) {
    for (let lon = 0; lon < 360; lon += 15) {
      const p = project(lat, lon, rotationDeg, radius, cx, cy);
      if (p.z <= 0) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${0.1 + p.z * 0.4})`; // --signal
      ctx.fill();
    }
  }

  // Lagos marker
  const lagos = project(LAGOS.lat, LAGOS.lon, rotationDeg, radius, cx, cy);
  if (lagos.z <= 0) return;

  ctx.beginPath();
  ctx.arc(lagos.x, lagos.y, found ? 3.5 : 2.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(96, 239, 188, ${0.4 + lagos.z * 0.6})`; // --phosphor
  ctx.fill();

  if (!found) return;

  // Two expanding ping rings, phase-offset by half a cycle
  for (let i = 0; i < 2; i++) {
    const p = (pingProgress * 2 + i * 0.5) % 1;
    ctx.beginPath();
    ctx.arc(lagos.x, lagos.y, 4 + p * 30, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(96, 239, 188, ${(1 - p) * 0.5})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}
