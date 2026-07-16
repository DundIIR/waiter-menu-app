import { Product } from '@prisma/client'
import { axiosInstance } from './instance'
import { ApiRoutes } from './constans'

export const search = async (query: string, limit?: number): Promise<Product[]> => {
	const { data } = await axiosInstance.get<Product[]>(ApiRoutes.SEARCH_PRODUCTS, {
		params: { query, limit },
	})

	return data
}
