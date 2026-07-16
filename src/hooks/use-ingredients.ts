import { Api } from '@/services/api-client'
import { useIngredientStore } from '@/store/ingredient'
import { Ingredient } from '@prisma/client'
import { useEffect, useState } from 'react'
import { useSet } from 'react-use'

type IngredientOptions = {
	text: string
	value: string
}

interface ReturnProps {
	ingredients: Ingredient[]
	ingredientOptions: IngredientOptions[]
	loading: boolean
}

export const useFilterIngredients = (): ReturnProps => {
	const { setIngredients: setStoreIngredients } = useIngredientStore()

	const [ingredients, setIngredients] = useState<ReturnProps['ingredients']>([])

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchIngredients() {
			setLoading(true)
			try {
				const ingredients = await Api.ingredients.getAll()
				setIngredients(ingredients)
				setStoreIngredients(ingredients)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		fetchIngredients()
	}, [])

	return {
		ingredients,
		ingredientOptions: ingredients.map(ingredient => ({
			text: ingredient.name,
			value: String(ingredient.id),
		})),
		loading,
	}
}
