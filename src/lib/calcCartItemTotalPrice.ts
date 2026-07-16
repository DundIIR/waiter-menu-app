import { CartItemDTO } from '@/types/cart.dto'

export const calcCartItemTotalPrice = (item: CartItemDTO): number => {
	return (
		(item.ingredients.reduce((acc, item) => acc + item.price, 0) + item.productItem.price) *
		item.quantity
	)
}
