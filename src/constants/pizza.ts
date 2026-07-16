import { IPizzaSize, IPizzaType } from '@/types/prisma'

export const mapPizzaSize: Record<IPizzaSize, string> = {
	SMALL: 'Маленькая',
	MEDIUM: 'Средняя',
	LARGE: 'Большая',
} as const

export const mapPizzaSizeSm: Record<IPizzaSize, string> = {
	SMALL: '25',
	MEDIUM: '30',
	LARGE: '35',
} as const

export const mapPizzaType: Record<IPizzaType, string> = {
	THIN: 'Тонкое',
	REGULAR: 'Традиционное',
} as const

export const pizzaSizes = Object.entries(mapPizzaSize).map(([value, name]) => ({ name, value }))

export const pizzaTypes = Object.entries(mapPizzaType).map(([value, name]) => ({
	name,
	value,
	disabled: false,
}))
