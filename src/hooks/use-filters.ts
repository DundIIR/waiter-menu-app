'use client'

import { useState } from 'react'
import { useDebounce, useSet } from 'react-use'
import qs from 'qs'
import { useRouter } from 'next/navigation'

interface ReturnProps {
	price: Price
	selectedIngredients: Set<string>
	selectedSizes: Set<string>
	selectedTypes: Set<string>
	setPrice: (price: Price) => void
	setIngredients: (id: string) => void
	setSizes: (id: string) => void
	setTypes: (id: string) => void
	updatePrice: (name: keyof Price, value: number) => void
}

interface Price {
	priceFrom?: number
	priceTo?: number
}

export const useFilters = (): ReturnProps => {
	const router = useRouter()

	const [price, setPrice] = useState<Price>({})
	const [selectedIngredients, { toggle: toggleIngredients }] = useSet(new Set<string>([]))
	const [selectedSizes, { toggle: toggleSizes }] = useSet(new Set<string>([]))
	const [selectedTypes, { toggle: toggleTypes }] = useSet(new Set<string>([]))

	useDebounce(
		() => {
			const filters = {
				pizzaTypes: Array.from(selectedTypes),
				pizzaSizes: Array.from(selectedSizes),
				ingredients: Array.from(selectedIngredients),
				...price,
			}

			const queryString = qs.stringify(filters, { skipNulls: true, arrayFormat: 'comma' })

			router.push(`?${queryString}`, { scroll: false })
		},
		250,
		[selectedIngredients, selectedSizes, selectedTypes, price],
	)

	const updatePrice = (name: keyof Price, value: number) => {
		setPrice({ ...price, [name]: value })
	}

	return {
		price,
		selectedIngredients,
		selectedSizes,
		selectedTypes,
		setPrice,
		setIngredients: toggleIngredients,
		setSizes: toggleSizes,
		setTypes: toggleTypes,
		updatePrice,
	}
}
