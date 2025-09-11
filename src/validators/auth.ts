import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[a-z]/, 'Debe incluir una letra minúscula')
    .regex(/[A-Z]/, 'Debe incluir una letra mayúscula')
    .regex(/\d/, 'Debe incluir un número'),
  acceptedTerms: z.boolean().refine((v) => v === true, 'Debes aceptar los Términos'),
  acceptedPrivacy: z.boolean().refine((v) => v === true, 'Debes aceptar la Privacidad'),
});

export type RegisterForm = z.infer<typeof registerSchema>;


