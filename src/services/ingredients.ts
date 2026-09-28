import { Ingredient } from '@prisma/client'
import { axiosInstance } from './instance'
import { ApiRoutes } from './constans'

export const getAll = async (): Promise<Ingredient[]> => {
	const { data } = await axiosInstance.get<Ingredient[]>(ApiRoutes.INGREDIENTS)

	return data
}

export const create = async (name: string, imageUrl: string): Promise<Ingredient> => {
	const { data } = await axiosInstance.post<Ingredient>(ApiRoutes.INGREDIENTS, { name, imageUrl })

	return data
}
