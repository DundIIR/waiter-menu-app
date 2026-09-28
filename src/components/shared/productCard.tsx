'use client'

import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Title } from '../ui/title'
import { DishWithRelations } from '@/types/prisma'
import { useDishModalStore } from '@/store/dishModal'

type ProductCardVariant = 'default' | 'filled'

interface IProps {
	dish: DishWithRelations
	/** `filled` — фоновый квадрат растянут на всю карточку, название и состав лежат на нём */
	variant?: ProductCardVariant
	className?: string
}

const ProductCard: FC<IProps> = ({ dish, variant = 'default', className }): JSX.Element => {
	const openDish = useDishModalStore(state => state.openDish)
	const isFilled = variant === 'filled'

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => openDish(dish)}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					openDish(dish)
				}
			}}
			className={cn('cursor-pointer', isFilled && 'bg-secondary rounded-2xl p-3 shadow-sm', className)}>
			<div
				className={cn(
					'relative flex justify-center items-center p-6 h-[260px] overflow-hidden group',
					!isFilled && 'bg-secondary rounded-lg'
				)}>
				<Image
					width={215}
					height={215}
					src={dish.imageUrl}
					alt={dish.name}
					className="w-[215px] h-[215px] object-contain translate-y-2 transition-transform duration-150 ease-out group-hover:scale-110 group-hover:-translate-y-0"
				/>

				<span
					className={cn(
						'absolute flex items-baseline gap-2 rounded-[8px] bg-[hsl(32_100%_94%)]',
						isFilled ? 'bottom-0 left-0 px-3 py-2' : 'bottom-3 left-3 px-2.5 py-1'
					)}>
					<b className="text-sm leading-none">{Math.round(dish.price / 100)} ₽</b>
					<span className="text-xs leading-none text-gray-400">{dish.weight} г</span>
				</span>
			</div>
			<div className={cn(isFilled && 'mt-3')}>
				<Title text={dish.name} size="sm" className={cn('mb-1 font-bold', !isFilled && 'mt-3')} />
				<p className="text-sm text-gray-400 line-clamp-2">{dish.ingredients.map(item => item.name).join(', ')}</p>
			</div>
		</div>
	)
}

export default ProductCard
