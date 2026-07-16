import { CartStateItem } from './getCartDetails'

export const calcCountProductCart = (items: CartStateItem[]) => {
	let count = 0
	items.forEach((item: CartStateItem) => {
		count += item.quantity
	})
	return count
}
