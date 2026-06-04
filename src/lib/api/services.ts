import type { ServiceId } from "./types";

export interface ServiceCatalogItem {
  id: ServiceId;
  name: string;
  price: number;
  description: string;
}

// Single source of truth for service definitions used across booking,
// pricing, and admin dashboard surfaces.
export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  { id: "sofa", name: "Sofa Cleaning", price: 1200, description: "Deep extraction for sofas & couches" },
  { id: "mattress", name: "Mattress Cleaning", price: 1500, description: "Sanitization & dust mite removal" },
  { id: "rug", name: "Rug Cleaning", price: 900, description: "Gentle care for all rug types" },
  { id: "full", name: "Full Deep Cleaning Package", price: 3500, description: "Complete home fabric refresh" },
];

export function getService(id: ServiceId): ServiceCatalogItem | undefined {
  return SERVICE_CATALOG.find((s) => s.id === id);
}
