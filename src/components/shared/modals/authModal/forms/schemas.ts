import { z } from 'zod'

export const passwordSchema = z.string().min(4, { message: 'Введите корректный пароль' })

export const formLoginSchema = z.object({
	email: z.email({ message: 'Введите корректную почту' }),
	password: passwordSchema,
})

export const formRegisterSchema = formLoginSchema
	.extend({
		fullName: z.string().min(2, { message: 'Введите имя и фамилию' }),
		confirmPassword: passwordSchema,
	})
	.refine(data => data.confirmPassword === data.password, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword'],
	})

export type TFormLogin = z.infer<typeof formLoginSchema>
export type TFormRegister = z.infer<typeof formRegisterSchema>
