import { Ingredient, PizzaSize, PizzaType, Product, ProductItem } from '@prisma/client'

export type ProductWithRelations = Product & {
	variations: ProductItem[]
	ingredients: Ingredient[]
}

export type IPizzaSize = PizzaSize
export type IPizzaType = PizzaType
