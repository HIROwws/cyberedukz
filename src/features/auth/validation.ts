import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(80, "Имя слишком длинное"),
  email: z.string().trim().email("Введите корректный email").toLowerCase(),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(128, "Пароль слишком длинный"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

