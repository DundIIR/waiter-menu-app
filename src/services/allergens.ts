import { Allergen } from '@prisma/client'
import { axiosInstance } from './instance'
import { ApiRoutes } from './constans'

export const getAll = async (): Promise<Allergen[]> => {
	const { data } = await axiosInstance.get<Allergen[]>(ApiRoutes.ALLERGENS)

	return data
}

export const create = async (name: string): Promise<Allergen> => {
	const { data } = await axiosInstance.post<Allergen>(ApiRoutes.ALLERGENS, { name })

	return data
}
