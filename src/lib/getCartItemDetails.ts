import { PizzaSize, PizzaType } from '@prisma/client'
import { CartStateItem } from './getCartDetails'
import { mapPizzaSizeSm, mapPizzaType } from '@/constants/pizza'

/**
 * Функция для получения строкового описания элемента корзины.
 *
 * @param {CartStateItem['ingredients']} ingredients - список ингредиентов
 * @param {IPizzaType} [pizzaType] - тип пиццы
 * @param {IPizzaSize} [pizzaSize] - размер пиццы
 *
 * @returns {string} строковое описание элемента корзины
 */
export const getCartItemDetails = (
	ingredients: CartStateItem['ingredients'],
	pizzaType?: PizzaType,
	pizzaSize?: PizzaSize,
): string => {
	const details = []

	if (pizzaSize && pizzaType) {
		const size = mapPizzaSizeSm[pizzaSize]
		details.push(`Пицца ${size}см, ${mapPizzaType[pizzaType]} тесто`)
	}

	if (ingredients.length > 0) {
		details.push(`+ ${ingredients.map(ingredient => ingredient.name).join(', ')}`)
	}

	return details.join('\n')
}
