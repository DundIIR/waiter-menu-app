import { axiosInstance } from './instance'
import { ApiRoutes } from './constans'
import { Story, StoryItem } from '@prisma/client'

export type IStory = Story & {
	items: StoryItem[]
}

export const getAll = async () => {
	const { data } = await axiosInstance.get<IStory[]>(ApiRoutes.STORIES)

	return data
}
