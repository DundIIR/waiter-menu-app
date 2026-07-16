'use client'

import React, { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { Api } from '@/services/api-client'
import { IStory } from '@/services/stories'
import { Container } from './container'
import { X } from 'lucide-react'
import ReactStories from 'react-insta-stories'

interface IProps {
	className?: string
}

const Stories: FC<IProps> = ({ className }): JSX.Element => {
	const [stories, setStories] = React.useState<IStory[]>([])
	const [open, setOpen] = React.useState(false)
	const [selectedStory, setSelectedStory] = React.useState<IStory>()

	React.useEffect(() => {
		async function fetchStories() {
			const data = await Api.stories.getAll()
			setStories(data)
		}

		fetchStories()
	}, [])

	const onClickStory = (story: IStory) => {
		setSelectedStory(story)

		if (story.items.length > 0) {
			setOpen(true)
		}
	}

	console.log(stories)

	return (
		<>
			<Container className={cn('flex items-center justify-between gap-2 my-10', className)}>
				{stories.length === 0 &&
					[...Array(6)].map((_, index) => (
						<div key={index} className="w-[200px] h-[250px] bg-gray-200 rounded-md animate-pulse" />
					))}
				{stories.map(story => (
					<img
						key={story.id}
						onClick={() => onClickStory(story)}
						className="rounded-md cursor-pointer"
						height={250}
						width={200}
						src={story.previewImageUrl}
					/>
				))}
				{open && (
					<div className="absolute left-0 top-0 w-full h-full bg-black/80 flex items-center justify-center z-30 backdrop-blur-sm">
						<div className="relative" style={{ height: '90vh', width: '560px' }}>
							<button className="absolute -right-10 -top-5 z-30" onClick={() => setOpen(false)}>
								<X className="absolute top-0 right-0 w-8 h-8 text-white/50" />
							</button>

							<ReactStories
								onAllStoriesEnd={() => setOpen(false)}
								stories={selectedStory?.items.map(item => ({ url: item.sourceUrl })) || []}
								defaultInterval={3000}
								width={'560px'}
								height={'90vh'}
								storyStyles={{ borderRadius: 20 }}
								storyContainerStyles={{ backgroundColor: 'transparent' }}
							/>
						</div>
					</div>
				)}
			</Container>
		</>
	)
}

export default Stories
