import { useCartStore } from '@/store'
import { useEffect } from 'react'

const UseCart = () => {
	const { totalAmount, items, loading, fetchCartItems, updateItemQuantity, removeCartItem } =
		useCartStore()

	const firstLoading = items.length === 0 && loading

	const handleClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
		updateItemQuantity(id, type === 'plus' ? quantity + 1 : quantity - 1)
	}

	useEffect(() => {
		if (firstLoading) {
			fetchCartItems()
		}
	}, [])

	return {
		totalAmount,
		items,
		loading,
		firstLoading,
		updateItemQuantity,
		removeCartItem,
		handleClickCountButton,
	}
}

export default UseCart
