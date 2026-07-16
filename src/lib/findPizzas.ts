import { PizzaSize, PizzaType } from '@prisma/client'
import { prisma } from '../../prisma/prisma-client'

export interface GetSearchParams {
	query?: string
	sortBy?: string
	pizzaSizes?: string
	pizzaTypes?: string
	ingredients?: string
	priceFrom?: string
	priceTo?: string
}

const DEFAULT_MIN_PRICE = 0
const DEFAULT_MAX_PRICE = 1000

export const findPizzas = async (params: GetSearchParams) => {
	const pizzaSizes = params?.pizzaSizes
		?.split(',')
		.map((size: string): PizzaSize => size as PizzaSize)
	const pizzaTypes = params?.pizzaTypes
		?.split(',')
		.map((type: string): PizzaType => type as PizzaType)
	const ingredients = params?.ingredients?.split(',').map(Number)

	const minPrice = params?.priceFrom ? Number(params.priceFrom) : DEFAULT_MIN_PRICE
	const maxPrice = params?.priceTo ? Number(params.priceTo) : DEFAULT_MAX_PRICE

	const categories = await prisma.category.findMany({
		include: {
			products: {
				orderBy: {
					id: 'desc',
				},
				where: {
					ingredients: ingredients ? { some: { id: { in: ingredients } } } : undefined,
					variations: {
						some: {
							size: {
								in: pizzaSizes,
							},
							pizzaType: {
								in: pizzaTypes,
							},
							price: {
								gte: minPrice,
								lte: maxPrice,
							},
						},
					},
				},

				include: {
					variations: {
						where: {
							price: {
								gte: minPrice,
								lte: maxPrice,
							},
						},
						orderBy: { price: 'asc' },
					},
					ingredients: true,
				},
			},
		},
	})

	return categories
}
