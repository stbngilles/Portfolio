"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { auth } from "@/lib/auth";
import { type Buffer } from "node:buffer";

const VALID_ROLES = ["ADMIN", "COMMERCIAL", "CLIENT", "DEV", "COMPTABLE"] as const;

/**
 * Server Action — changement de rôle d'un user par un admin.
 * Le `userId` est passé via .bind() côté page (fermeture serveur),
 * la nouvelle valeur de rôle vient du form (champ select name="role").
 */
export async function changeUserRole(userId: string, formData: FormData) {
  const { session } = await requireRole("ADMIN");

  const role = String(formData.get("role") ?? "");

  console.log("[changeUserRole]", { userId, role, by: session.user.email });

  if (!userId || !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    throw new Error(`Données invalides : userId="${userId}" role="${role}"`);
  }
  if (userId === session.user.id) {
    throw new Error("Vous ne pouvez pas changer votre propre rôle.");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  console.log("[changeUserRole] ok →", updated.email, "now", updated.role);

  revalidatePath("/app/admin/users");
}

/**
 * Crée un compte membre (COMMERCIAL, DEV, COMPTABLE, ADMIN) directement depuis l'admin.
 * Génère un mot de passe temporaire à transmettre manuellement (WhatsApp, SMS, etc.).
 */
export async function inviteMember(formData: FormData) {
  await requireRole("ADMIN");

  const name  = String(formData.get("name")  ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role  = String(formData.get("role")  ?? "COMMERCIAL");

  if (!name || !email) throw new Error("Nom et email requis.");
  if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    throw new Error("Rôle invalide.");
  }

  // Vérifier que l'email n'est pas déjà utilisé
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error(`Un compte existe déjà pour ${email}.`);

  // Générer un mot de passe temporaire lisible : 4 groupes de 3 chars
  const tempPassword = [
    randomBytes(2).toString("hex"),
    randomBytes(2).toString("hex"),
    randomBytes(2).toString("hex"),
  ].join("-"); // ex. a3f2-91bc-4d7e

  // Créer le compte via Better-Auth
  await auth.api.signUpEmail({
    body: { email, password: tempPassword, name },
  });

  // Mettre à jour le rôle (signup crée CLIENT par défaut)
  await prisma.user.update({
    where: { email },
    data: { role },
  });

  revalidatePath("/app/admin/users");

  // Rediriger vers la page avec les credentials à copier (une seule fois)
  const params = new URLSearchParams({
    created: "1",
    name,
    email,
    tempPwd: tempPassword,
    role,
  });
  redirect(`/app/admin/users?${params.toString()}`);
}

/**
 * Génère un nouveau mot de passe temporaire pour un utilisateur existant.
 * À utiliser quand quelqu'un a perdu/oublié ses identifiants.
 * Le nouveau mdp est affiché une seule fois à l'admin.
 */
export async function resetMemberPassword(userId: string) {
  const { session } = await requireRole("ADMIN");

  if (userId === session.user.id) {
    throw new Error("Changez votre propre mot de passe depuis vos paramètres.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) throw new Error("Utilisateur introuvable.");

  // Générer un nouveau mot de passe temporaire
  const newPassword = [
    randomBytes(2).toString("hex"),
    randomBytes(2).toString("hex"),
    randomBytes(2).toString("hex"),
  ].join("-");

  // Hasher avec le même algo que Better-Auth (scrypt N=16384, r=16, p=1, dkLen=64)
  const salt = randomBytes(16).toString("hex");
  const key = await new Promise<Buffer>((resolve, reject) => {
    const { scrypt } = require("node:crypto");
    scrypt(
      newPassword.normalize("NFKC"),
      salt,
      64,
      { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
      (err: Error | null, derived: Buffer) => {
        if (err) reject(err);
        else resolve(derived);
      },
    );
  });
  const hashedPassword = `${salt}:${key.toString("hex")}`;

  // Mettre à jour l'Account credential directement en base
  await prisma.account.updateMany({
    where: { userId: user.id, providerId: "credential" },
    data: { password: hashedPassword },
  });

  revalidatePath("/app/admin/users");

  const params = new URLSearchParams({
    reset: "1",
    userId,
    name:    user.name ?? user.email,
    email:   user.email,
    tempPwd: newPassword,
    role:    user.role,
  });
  redirect(`/app/admin/users?${params.toString()}`);
}
