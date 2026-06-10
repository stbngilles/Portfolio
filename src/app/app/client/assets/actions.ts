"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import {
  parseAssetsState,
  setAssetsState,
  isAssetsComplete,
  type AssetKey,
} from "@/lib/assets";
import { maybePublishToDevPool } from "@/lib/automations";

const KEYS: AssetKey[] = ["logo", "texts", "photos", "branding"];

export async function toggleAsset(formData: FormData) {
  const { session } = await requireRole("CLIENT", "ADMIN");
  const projectId = String(formData.get("projectId") ?? "");
  const key = String(formData.get("key") ?? "") as AssetKey;
  if (!projectId || !KEYS.includes(key)) throw new Error("Champs invalides.");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projet introuvable.");
  if (project.clientId !== session.user.id) throw new Error("Accès refusé.");

  const current = parseAssetsState(project.assetsState);
  current[key] = !current[key];
  await setAssetsState(projectId, current);

  if (isAssetsComplete(JSON.stringify(current))) {
    await maybePublishToDevPool(projectId);
  }

  revalidatePath("/app/client");
  revalidatePath("/app/client/assets");
  revalidatePath(`/app/admin/projects/${projectId}`);
  revalidatePath("/app/admin");
  revalidatePath("/app/dev/disponibles");
}
