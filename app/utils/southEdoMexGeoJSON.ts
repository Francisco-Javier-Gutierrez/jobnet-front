import * as turf from "@turf/turf";

export interface SouthEdoMexMuniFeature {
  name: string;
  polygon: turf.Feature<turf.Polygon>;
  center: [number, number]; // [lng, lat]
}

// Collection of South Estado de México Municipalities GeoJSON Polygons
export const SOUTH_EDOMEX_FEATURES: SouthEdoMexMuniFeature[] = [
  {
    name: "Toluca, Estado de México",
    center: [-99.6557, 19.2826],
    polygon: turf.polygon([
      [
        [-99.75, 19.35],
        [-99.55, 19.35],
        [-99.55, 19.18],
        [-99.75, 19.18],
        [-99.75, 19.35],
      ],
    ]),
  },
  {
    name: "Metepec, Estado de México",
    center: [-99.6048, 19.2564],
    polygon: turf.polygon([
      [
        [-99.64, 19.29],
        [-99.55, 19.29],
        [-99.55, 19.21],
        [-99.64, 19.21],
        [-99.64, 19.29],
      ],
    ]),
  },
  {
    name: "Zinacantepec, Estado de México",
    center: [-99.7303, 19.2858],
    polygon: turf.polygon([
      [
        [-99.88, 19.35],
        [-99.72, 19.35],
        [-99.72, 19.12],
        [-99.88, 19.12],
        [-99.88, 19.35],
      ],
    ]),
  },
  {
    name: "San Mateo Atenco, Estado de México",
    center: [-99.5328, 19.2678],
    polygon: turf.polygon([
      [
        [-99.56, 19.29],
        [-99.5, 19.29],
        [-99.5, 19.23],
        [-99.56, 19.23],
        [-99.56, 19.29],
      ],
    ]),
  },
  {
    name: "Lerma, Estado de México",
    center: [-99.5108, 19.2861],
    polygon: turf.polygon([
      [
        [-99.55, 19.35],
        [-99.42, 19.35],
        [-99.42, 19.22],
        [-99.55, 19.22],
        [-99.55, 19.35],
      ],
    ]),
  },
  {
    name: "Calimaya, Estado de México",
    center: [-99.6178, 19.1611],
    polygon: turf.polygon([
      [
        [-99.68, 19.21],
        [-99.56, 19.21],
        [-99.56, 19.1],
        [-99.68, 19.1],
        [-99.68, 19.21],
      ],
    ]),
  },
  {
    name: "Tenango del Valle, Estado de México",
    center: [-99.5889, 19.1062],
    polygon: turf.polygon([
      [
        [-99.68, 19.15],
        [-99.52, 19.15],
        [-99.52, 19.03],
        [-99.68, 19.03],
        [-99.68, 19.15],
      ],
    ]),
  },
  {
    name: "Tenancingo, Estado de México",
    center: [-99.5917, 18.9619],
    polygon: turf.polygon([
      [
        [-99.66, 19.04],
        [-99.53, 19.04],
        [-99.53, 18.89],
        [-99.66, 18.89],
        [-99.66, 19.04],
      ],
    ]),
  },
  {
    name: "Malinalco, Estado de México",
    center: [-99.4967, 18.9482],
    polygon: turf.polygon([
      [
        [-99.54, 19.03],
        [-99.4, 19.03],
        [-99.4, 18.86],
        [-99.54, 18.86],
        [-99.54, 19.03],
      ],
    ]),
  },
  {
    name: "Ocuilan, Estado de México",
    center: [-99.4128, 18.9772],
    polygon: turf.polygon([
      [
        [-99.45, 19.06],
        [-99.28, 19.06],
        [-99.28, 18.88],
        [-99.45, 18.88],
        [-99.45, 19.06],
      ],
    ]),
  },
  {
    name: "Ixtapan de la Sal, Estado de México",
    center: [-99.6761, 18.8441],
    polygon: turf.polygon([
      [
        [-99.74, 18.91],
        [-99.61, 18.91],
        [-99.61, 18.79],
        [-99.74, 18.79],
        [-99.74, 18.91],
      ],
    ]),
  },
  {
    name: "Tonatico, Estado de México",
    center: [-99.6694, 18.8044],
    polygon: turf.polygon([
      [
        [-99.73, 18.82],
        [-99.61, 18.82],
        [-99.61, 18.72],
        [-99.73, 18.72],
        [-99.73, 18.82],
      ],
    ]),
  },
  {
    name: "Villa Guerrero, Estado de México",
    center: [-99.6469, 18.9622],
    polygon: turf.polygon([
      [
        [-99.71, 19.02],
        [-99.57, 19.02],
        [-99.57, 18.89],
        [-99.71, 18.89],
        [-99.71, 19.02],
      ],
    ]),
  },
  {
    name: "Coatepec Harinas, Estado de México",
    center: [-99.7681, 18.9217],
    polygon: turf.polygon([
      [
        [-99.83, 18.99],
        [-99.69, 18.99],
        [-99.69, 18.84],
        [-99.83, 18.84],
        [-99.83, 18.99],
      ],
    ]),
  },
  {
    name: "Zacualpan, Estado de México",
    center: [-99.7789, 18.7186],
    polygon: turf.polygon([
      [
        [-99.84, 18.79],
        [-99.71, 18.79],
        [-99.71, 18.64],
        [-99.84, 18.64],
        [-99.84, 18.79],
      ],
    ]),
  },
  {
    name: "Valle de Bravo, Estado de México",
    center: [-100.1311, 19.1925],
    polygon: turf.polygon([
      [
        [-100.25, 19.28],
        [-100.0, 19.28],
        [-100.0, 19.1],
        [-100.25, 19.1],
        [-100.25, 19.28],
      ],
    ]),
  },
  {
    name: "Temascaltepec, Estado de México",
    center: [-100.0456, 19.0428],
    polygon: turf.polygon([
      [
        [-100.14, 19.14],
        [-99.92, 19.14],
        [-99.92, 18.96],
        [-100.14, 18.96],
        [-100.14, 19.14],
      ],
    ]),
  },
  {
    name: "Tejupilco, Estado de México",
    center: [-100.1528, 18.9064],
    polygon: turf.polygon([
      [
        [-100.32, 19.02],
        [-100.0, 19.02],
        [-100.0, 18.8],
        [-100.32, 18.8],
        [-100.32, 19.02],
      ],
    ]),
  },
  {
    name: "Sultepec, Estado de México",
    center: [-99.9628, 18.8475],
    polygon: turf.polygon([
      [
        [-100.1, 18.92],
        [-99.85, 18.92],
        [-99.85, 18.75],
        [-100.1, 18.75],
        [-100.1, 18.92],
      ],
    ]),
  },
  {
    name: "Amatepec, Estado de México",
    center: [-100.1839, 18.6824],
    polygon: turf.polygon([
      [
        [-100.34, 18.8],
        [-100.03, 18.8],
        [-100.03, 18.6],
        [-100.34, 18.6],
        [-100.34, 18.8],
      ],
    ]),
  },
  {
    name: "Tlatlaya, Estado de México",
    center: [-100.2078, 18.6186],
    polygon: turf.polygon([
      [
        [-100.38, 18.68],
        [-100.05, 18.68],
        [-100.05, 18.35],
        [-100.38, 18.35],
        [-100.38, 18.68],
      ],
    ]),
  },
  {
    name: "Luvianos, Estado de México",
    center: [-100.4008, 18.9242],
    polygon: turf.polygon([
      [
        [-100.58, 19.04],
        [-100.25, 19.04],
        [-100.25, 18.82],
        [-100.58, 18.82],
        [-100.58, 19.04],
      ],
    ]),
  },
  {
    name: "Almoloya de Juárez, Estado de México",
    center: [-99.7622, 19.3689],
    polygon: turf.polygon([
      [
        [-99.94, 19.46],
        [-99.7, 19.46],
        [-99.7, 19.31],
        [-99.94, 19.31],
        [-99.94, 19.46],
      ],
    ]),
  },
  {
    name: "Otzoloapan, Estado de México",
    center: [-100.2974, 19.1171],
    polygon: turf.polygon([
      [
        [-100.37, 19.17],
        [-100.22, 19.17],
        [-100.22, 19.08],
        [-100.37, 19.08],
        [-100.37, 19.17],
      ],
    ]),
  },
  {
    name: "Zacazonapan, Estado de México",
    center: [-100.2589, 19.0734],
    polygon: turf.polygon([
      [
        [-100.32, 19.09],
        [-100.19, 19.09],
        [-100.19, 19.04],
        [-100.32, 19.04],
        [-100.32, 19.09],
      ],
    ]),
  },
  {
    name: "Santo Tomás, Estado de México",
    center: [-100.2811, 19.1834],
    polygon: turf.polygon([
      [
        [-100.35, 19.22],
        [-100.21, 19.22],
        [-100.21, 19.15],
        [-100.35, 19.15],
        [-100.35, 19.22],
      ],
    ]),
  },
];

/**
 * 100% Native Client-side Reverse Geocoding with Turf.js
 * Instantaneous (0ms latency, zero HTTP requests, zero rate limits)
 */
export function getNativeLocationName(lat: number, lng: number): string {
  const point = turf.point([lng, lat]);

  // 1. Check direct point-in-polygon containment
  for (const muni of SOUTH_EDOMEX_FEATURES) {
    if (turf.booleanPointInPolygon(point, muni.polygon)) {
      return muni.name;
    }
  }

  // 2. Fallback: calculate nearest municipality using Turf distance
  let closestName = "Toluca, Estado de México";
  let minDistance = Infinity;

  for (const muni of SOUTH_EDOMEX_FEATURES) {
    const centerPt = turf.point(muni.center);
    const dist = turf.distance(point, centerPt, { units: "kilometers" });
    if (dist < minDistance) {
      minDistance = dist;
      closestName = muni.name;
    }
  }

  return closestName;
}
