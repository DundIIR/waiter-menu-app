import { create } from 'zustand'

/**
 * include — показывать только блюда с выбранными значениями (плюс в заголовке),
 * exclude — наоборот, убирать такие блюда из списка (минус в заголовке).
 */
export type FilterMode = 'include' | 'exclude'

export interface State {
	selectedIngredients: Set<string>
	selectedAllergens: Set<string>
	ingredientsMode: FilterMode
	allergensMode: FilterMode
	toggleIngredient: (id: string) => void
	toggleAllergen: (id: string) => void
	/** Массово отметить/снять сразу список значений — для кнопки «Выбрать все» */
	selectIngredients: (ids: string[], selected: boolean) => void
	selectAllergens: (ids: string[], selected: boolean) => void
	toggleIngredientsMode: () => void
	toggleAllergensMode: () => void
	reset: () => void
}

const inverted = (mode: FilterMode): FilterMode => (mode === 'include' ? 'exclude' : 'include')

/** Set мутировать нельзя — zustand сравнивает по ссылке и не перерисует подписчиков */
const toggled = (source: Set<string>, id: string): Set<string> => {
	const next = new Set(source)

	if (next.has(id)) {
		next.delete(id)
	} else {
		next.add(id)
	}

	return next
}

const withValues = (source: Set<string>, ids: string[], selected: boolean): Set<string> => {
	const next = new Set(source)

	ids.forEach(id => (selected ? next.add(id) : next.delete(id)))

	return next
}

export const useFiltersStore = create<State>(set => ({
	selectedIngredients: new Set<string>(),
	selectedAllergens: new Set<string>(),
	ingredientsMode: 'include',
	allergensMode: 'include',

	toggleIngredient: (id: string) =>
		set(state => ({ selectedIngredients: toggled(state.selectedIngredients, id) })),

	toggleAllergen: (id: string) =>
		set(state => ({ selectedAllergens: toggled(state.selectedAllergens, id) })),

	selectIngredients: (ids: string[], selected: boolean) =>
		set(state => ({ selectedIngredients: withValues(state.selectedIngredients, ids, selected) })),

	selectAllergens: (ids: string[], selected: boolean) =>
		set(state => ({ selectedAllergens: withValues(state.selectedAllergens, ids, selected) })),

	toggleIngredientsMode: () => set(state => ({ ingredientsMode: inverted(state.ingredientsMode) })),

	toggleAllergensMode: () => set(state => ({ allergensMode: inverted(state.allergensMode) })),

	reset: () =>
		set({
			selectedIngredients: new Set(),
			selectedAllergens: new Set(),
			ingredientsMode: 'include',
			allergensMode: 'include',
		}),
}))
