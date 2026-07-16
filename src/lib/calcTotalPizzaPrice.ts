import { IPizzaSize, IPizzaType } from '@/types/prisma'
import { Ingredient, ProductItem } from '@prisma/client'

/**
 * Функция для расчета общей стоимости пиццы
 *
 * @param {ProductItem[]} variations - список вариантов продукта
 * @param {Ingredient[]} ingredients - список ингредиентов
 * @param {Set<number>} selectedIngredients - множество выбранных ингредиентов
 * @param {IPizzaSize} size - размер пиццы
 * @param {IPizzaType} type - тип пиццы
 *
 * @returns {number} общая стоимость пиццы
 */
export const calcTotalPizzaPrice = (
	variations: ProductItem[],
	ingredients: Ingredient[],
	selectedIngredients: Set<number>,
	size: IPizzaSize,
	type: IPizzaType,
) => {
	const pizzaPrice =
		variations.find(item => item.pizzaType === type && item.size === size)?.price || 0

	const totalIngredientsPrice = ingredients
		.filter(ingredient => selectedIngredients.has(ingredient.id))
		.reduce((acc, item) => acc + item.price, 0)

	const totalPrice = pizzaPrice + totalIngredientsPrice

	return totalPrice
}
