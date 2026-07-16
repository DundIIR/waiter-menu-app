import { pizzaTypes } from '@/constants/pizza'
import { IPizzaSize, IPizzaType } from '@/types/prisma'
import { ProductItem } from '@prisma/client'

/**
 * Функция для получения списка типов пиццы, доступных для текущего размера.
 *
 * @param {ProductItem[]} variations - список вариантов продукта
 * @param {IPizzaSize} size - размер пиццы
 *
 * @returns {IPizzaType[]} список типов пиццы, доступных для текущего размера
 */
export const getAvailablePizzaTypes = (variations: ProductItem[], size: IPizzaSize) => {
	const availablePizzaTypes = pizzaTypes.map(type => {
		const hasVariation = variations.some(
			item => item.size === size && item.pizzaType === type.value,
		)
		return {
			...type,
			disabled: !hasVariation,
		}
	})

	return availablePizzaTypes
}
