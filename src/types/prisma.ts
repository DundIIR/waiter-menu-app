import { Allergen, Category, Dish, Ingredient } from '@prisma/client'

export type DishWithRelations = Dish & {
	ingredients: Ingredient[]
	allergens: Allergen[]
}

export type CategoryWithDishes = Category & {
	dishes: DishWithRelations[]
}
