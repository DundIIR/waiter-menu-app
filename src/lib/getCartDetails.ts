import { CartDTO } from '@/types/cart.dto'
import { Cart, PizzaSize, PizzaType } from '@prisma/client'
import { calcCartItemTotalPrice } from '.'

export type CartStateItem = {
	id: number
	quantity: number
	name: string
	imageUrl: string
	price: number
	disabled?: boolean
	pizzaSize?: PizzaSize
	pizzaType?: PizzaType
	ingredients: Array<{ price: number; name: string }>
}

interface ReturnProps {
	items: CartStateItem[]
	totalAmount: number
}

export const getCartDetails = (data: CartDTO): ReturnProps => {
	const items = data.items.map(item => ({
		id: item.id,
		quantity: item.quantity,
		name: item.productItem.product.name,
		imageUrl: item.productItem.product.imageUrl,
		price: calcCartItemTotalPrice(item),
		disabled: false,
		pizzaSize: item.productItem.size ?? undefined,
		pizzaType: item.productItem.pizzaType ?? undefined,
		ingredients: item.ingredients.map(ingredient => ({
			price: ingredient.price,
			name: ingredient.name,
		})),
	}))

	return {
		items,
		totalAmount: data.totalAmount,
	}
}
