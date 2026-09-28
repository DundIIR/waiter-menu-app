import { prisma } from '../../prisma/prisma-client'

/**
 * Отдаёт всё опубликованное меню одним запросом.
 * Фильтрация по ингредиентам/аллергенам делается на клиенте
 * (см. homeClient.tsx), чтобы не ходить на сервер на каждый чекбокс.
 */
export const findDishes = async () => {
	const categories = await prisma.category.findMany({
		include: {
			dishes: {
				where: { isPublished: true },
				orderBy: { id: 'desc' },
				include: {
					ingredients: true,
					allergens: true,
				},
			},
		},
	})

	return categories
}
