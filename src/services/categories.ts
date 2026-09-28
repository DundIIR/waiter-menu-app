import { Category } from '@prisma/client'
import { axiosInstance } from './instance'
import { ApiRoutes } from './constans'

export const getAll = async (): Promise<Category[]> => {
	const { data } = await axiosInstance.get<Category[]>(ApiRoutes.CATEGORIES)

	return data
}
