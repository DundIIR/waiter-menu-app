import { DishWithRelations } from '@/types/prisma'
import { create } from 'zustand'

export interface DishModalState {
	dish: DishWithRelations | null
	isOpen: boolean

	/* Открыть модалку с конкретным блюдом */
	openDish: (dish: DishWithRelations) => void

	/* Закрыть модалку (блюдо остаётся в стейте до следующего открытия) */
	closeDish: () => void
}

export const useDishModalStore = create<DishModalState>(set => ({
	dish: null,
	isOpen: false,

	openDish: dish => set({ dish, isOpen: true }),
	closeDish: () => set({ isOpen: false }),
}))
