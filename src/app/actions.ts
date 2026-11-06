'use server'

import type { Prisma } from '@prisma/client'
import type { TCheckoutForm } from '@/components/shared/checkout/schemas/checkoutFormSchema'

export async function createOrder(_data: TCheckoutForm): Promise<string | undefined> {
	throw new Error('Оформление заказов отключено')
}

export async function updateUserInfo(_body: Prisma.UserUpdateInput): Promise<void> {
	throw new Error('Управление пользователями отключено')
}

export async function registerUser(_body: Prisma.UserCreateInput): Promise<void> {
	throw new Error('Регистрация отключена')
}
