'use client'

import { Api } from '@/services/api-client'
import { Allergen } from '@prisma/client'
import { useEffect, useState } from 'react'

type AllergenOptions = {
	text: string
	value: string
}

interface ReturnProps {
	allergens: Allergen[]
	allergenOptions: AllergenOptions[]
	loading: boolean
}

export const useFilterAllergens = (): ReturnProps => {
	const [allergens, setAllergens] = useState<ReturnProps['allergens']>([])

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchAllergens() {
			setLoading(true)
			try {
				const allergens = await Api.allergens.getAll()
				setAllergens(allergens)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		fetchAllergens()
	}, [])

	return {
		allergens,
		allergenOptions: allergens.map(allergen => ({
			text: allergen.name,
			value: String(allergen.id),
		})),
		loading,
	}
}
