import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better-Auth route handler — gère sign-in, sign-up, sign-out, sessions, etc.
// Tous les endpoints vivent sous /api/auth/*
export const { GET, POST } = toNextJsHandler(auth);
