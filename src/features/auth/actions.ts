"use server";

import { redirect } from "next/navigation";
import { registerSchema } from "./validation";

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Не удалось создать аккаунт");
  }

  // Day 2 implementation note:
  // 1. hash parsed.data.password with bcryptjs
  // 2. create User via Prisma
  // 3. create a session
  // 4. redirect to /profile
  redirect("/profile");
}

