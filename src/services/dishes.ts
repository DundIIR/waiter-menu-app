import { DishWithRelations } from '@/types/prisma'
import { axiosInstance } from './instance'
import { ApiRoutes } from './constans'

export interface CreateDishData {
	name: string
	description?: string
	imageUrl: string
	price: number
	weight: number
	categoryId: number
	isPublished?: boolean
	ingredientIds?: number[]
	allergenIds?: number[]
}

export const create = async (dish: CreateDishData): Promise<DishWithRelations> => {
	const { data } = await axiosInstance.post<DishWithRelations>(ApiRoutes.DISHES, dish)

	return data
}
