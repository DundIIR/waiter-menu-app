import { z } from 'zod'

export const checkoutFormSchema = z.object({
	firstName: z
		.string()
		.min(2, 'Имя должно содержать не менее 2 символов')
		.max(30, 'Имя должно содержать не более 30 символов'),
	lastName: z
		.string()
		.min(2, 'Имя должно содержать не менее 2 символов')
		.max(30, 'Имя должно содержать не более 30 символов'),
	email: z.email('Некорректный email'),
	phone: z.string().min(11, 'Некорректный номер телефона'),

	address: z.string().min(5, 'Некорректный адрес'),
	comment: z.string().optional(),
})

export type TCheckoutForm = z.infer<typeof checkoutFormSchema>
