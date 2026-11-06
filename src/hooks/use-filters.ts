'use client'

import { FilterMode, useFiltersStore } from '@/store/filters'

interface ReturnProps {
	selectedIngredients: Set<string>
	selectedAllergens: Set<string>
	ingredientsMode: FilterMode
	allergensMode: FilterMode
	setIngredients: (id: string) => void
	setAllergens: (id: string) => void
	selectIngredients: (ids: string[], selected: boolean) => void
	selectAllergens: (ids: string[], selected: boolean) => void
	toggleIngredientsMode: () => void
	toggleAllergensMode: () => void
	/** Сбрасывает и выбранные значения, и режимы групп */
	reset: () => void
}

/**
 * Состояние фильтров живёт в общем сторе, а не в URL: раньше каждый чекбокс
 * дёргал router.push, и страница целиком перезапрашивалась с сервера.
 * Теперь меню грузится один раз, а фильтрация идёт по загруженному списку.
 */
export const useFilters = (): ReturnProps => {
	const selectedIngredients = useFiltersStore(state => state.selectedIngredients)
	const selectedAllergens = useFiltersStore(state => state.selectedAllergens)
	const toggleIngredient = useFiltersStore(state => state.toggleIngredient)
	const toggleAllergen = useFiltersStore(state => state.toggleAllergen)
	const selectIngredients = useFiltersStore(state => state.selectIngredients)
	const selectAllergens = useFiltersStore(state => state.selectAllergens)
	const ingredientsMode = useFiltersStore(state => state.ingredientsMode)
	const allergensMode = useFiltersStore(state => state.allergensMode)
	const toggleIngredientsMode = useFiltersStore(state => state.toggleIngredientsMode)
	const toggleAllergensMode = useFiltersStore(state => state.toggleAllergensMode)
	const reset = useFiltersStore(state => state.reset)

	return {
		selectedIngredients,
		selectedAllergens,
		ingredientsMode,
		allergensMode,
		setIngredients: toggleIngredient,
		setAllergens: toggleAllergen,
		selectIngredients,
		selectAllergens,
		toggleIngredientsMode,
		toggleAllergensMode,
		reset,
	}
}
