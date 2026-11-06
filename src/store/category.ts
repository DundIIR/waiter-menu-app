import { Category } from '@prisma/client'
import { create } from 'zustand'

export interface State {
	activeId: number
	categories: Category[]
	/** Под фильтр не попало ни одного блюда: строка категорий видна, но кликать не по чему */
	disabled: boolean
	setActiveId: (activeId: number) => void
	setCategories: (categories: Category[]) => void
	setDisabled: (disabled: boolean) => void
}

export const useCategoryStore = create<State>(set => ({
	activeId: 1,
	categories: [],
	disabled: false,
	setActiveId: (activeId: number) => set({ activeId }),
	setCategories: (categories: Category[]) => set({ categories }),
	setDisabled: (disabled: boolean) => set({ disabled }),
}))
