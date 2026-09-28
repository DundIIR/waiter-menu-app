import { DishWithRelations } from '@/types/prisma'
import { axiosInstance } from './instance'
import { ApiRoutes } from './constans'

export const search = async (query: string, limit?: number): Promise<DishWithRelations[]> => {
	const { data } = await axiosInstance.get<DishWithRelations[]>(ApiRoutes.SEARCH_PRODUCTS, {
		params: { query, limit },
	})

	return data
}
