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
		const { items, loading } = useCartStore.getState()
		if (items.length === 0 && loading) {
			fetchCartItems()
		}
	}, [fetchCartItems])

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
