import { Ingredient } from '@prisma/client'
import { create } from 'zustand'

export interface State {
	ingredients: Ingredient[]
	setIngredients: (ingredients: Ingredient[]) => void
}

export const useIngredientStore = create<State>(set => ({
	ingredients: [],
	setIngredients: (ingredients: Ingredient[]) => set({ ingredients }),
}))
