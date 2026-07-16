import { Category } from '@prisma/client'
import { create } from 'zustand'

export interface State {
	activeId: number
	categories: Category[]
	setActiveId: (activeId: number) => void
	setCategories: (categories: Category[]) => void
}

export const useCategoryStore = create<State>(set => ({
	activeId: 1,
	categories: [],
	setActiveId: (activeId: number) => set({ activeId }),
	setCategories: (categories: Category[]) => set({ categories }),
}))
