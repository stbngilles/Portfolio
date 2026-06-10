/**
 * Tracker d'assets — état du dépôt par le client, lu par le pool dev pour
 * décider quand la mission peut partir en production.
 */
import { prisma } from "@/lib/db";

export type AssetKey = "logo" | "texts" | "photos" | "branding";

export const ASSET_LABELS: Record<AssetKey, string> = {
  logo: "Logo (fichiers vectoriels)",
  texts: "Textes / contenus rédigés",
  photos: "Photos / visuels",
  branding: "Charte / références graphiques",
};

export type AssetsState = Record<AssetKey, boolean>;

export function emptyAssetsState(): AssetsState {
  return { logo: false, texts: false, photos: false, branding: false };
}

export function parseAssetsState(raw: string | null | undefined): AssetsState {
  if (!raw) return emptyAssetsState();
  try {
    const parsed = JSON.parse(raw) as Partial<AssetsState>;
    return { ...emptyAssetsState(), ...parsed };
  } catch {
    return emptyAssetsState();
  }
}

export function isAssetsComplete(raw: string | null | undefined): boolean {
  const s = parseAssetsState(raw);
  return Object.values(s).every(Boolean);
}

export function assetsProgress(raw: string | null | undefined): {
  done: number;
  total: number;
  pct: number;
} {
  const s = parseAssetsState(raw);
  const total = Object.keys(s).length;
  const done = Object.values(s).filter(Boolean).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export async function setAssetsState(
  projectId: string,
  state: AssetsState,
): Promise<void> {
  await prisma.project.update({
    where: { id: projectId },
    data: { assetsState: JSON.stringify(state) },
  });
}
