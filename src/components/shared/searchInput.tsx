'use client'

import { FC, JSX, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useClickAway, useDebounce } from 'react-use'
import Image from 'next/image'
import { Api } from '@/services/api-client'
import { DishWithRelations } from '@/types/prisma'
import { useDishModalStore } from '@/store/dishModal'

interface IProps {
	className?: string
}

const SearchInput: FC<IProps> = ({ className }): JSX.Element => {
	const [searchQuery, setSearchQuery] = useState('')
	const [focused, setFocused] = useState(false)
	const [dishes, setDishes] = useState<DishWithRelations[]>([])
	const ref = useRef<HTMLDivElement>(null)
	const openDish = useDishModalStore(state => state.openDish)

	useClickAway(ref, () => {
		setFocused(false)
	})

	useDebounce(
		() => {
			Api.products.search(searchQuery, 10).then(data => setDishes(data))
		},
		300,
		[searchQuery],
	)

	const onClickDish = (dish: DishWithRelations) => {
		setSearchQuery('')
		setFocused(false)
		setDishes([])
		openDish(dish)
	}

	return (
		<>
			{focused && <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-15"></div>}
			<div
				ref={ref}
				className={cn('flex rounded-2xl flex-1 justify-between relative h-11 z-15', className)}>
				<Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
				<input
					className="rounded-2xl outline-none w-full bg-gray-50 pl-11 font-medium"
					type="text"
					placeholder="Найти блюдо..."
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					onFocus={() => setFocused(true)}
				/>
			</div>

			{dishes.length > 0 && (
				<div
					className={cn(
						'absolute w-full bg-white rounded-xl py-3 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-15',
						focused && 'visible opacity-100 top-12',
					)}>
					{dishes.map(dish => {
						return (
							<div
								key={dish.id}
								role="button"
								tabIndex={0}
								onClick={() => onClickDish(dish)}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										onClickDish(dish)
									}
								}}
								className="flex items-center gap-4 px-4 py-2 hover:bg-primary/10 transition ease-in-out duration-150 cursor-pointer">
								<Image
									className="rounded-md object-cover"
									src={dish.imageUrl}
									alt={dish.name}
									width={40}
									height={40}
								/>
								<p className="font-semibold text-lg">{dish.name}</p>
							</div>
						)
					})}
				</div>
			)}
		</>
	)
}

export default SearchInput
