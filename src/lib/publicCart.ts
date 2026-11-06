import { Cart } from '@prisma/client'

export function publicCart<T extends Cart>(cart: T | null | undefined) {
	if (!cart) return cart
	const { token, userId, ...safeCart } = cart
	return safeCart
}
