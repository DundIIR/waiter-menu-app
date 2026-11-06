import { Allergen, Category, Dish, Ingredient, PizzaSize, PizzaType, Product, ProductItem } from '@prisma/client'

export type DishWithRelations = Dish & { ingredients: Ingredient[]; allergens: Allergen[] }
export type CategoryWithDishes = Category & { dishes: DishWithRelations[] }

export type ProductWithRelations = Product & {
	variations: ProductItem[]
	ingredients: Ingredient[]
}

export type IPizzaSize = PizzaSize
export type IPizzaType = PizzaType
