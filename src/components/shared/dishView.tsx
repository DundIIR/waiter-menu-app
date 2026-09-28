'use client'

import { FC, JSX, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Title } from '../ui/title'
import { DishWithRelations } from '@/types/prisma'
import DishIngredientCard from './dishIngredientCard'

interface IProps {
	dish: DishWithRelations
	className?: string
}

const DESCRIPTION_COLLAPSED_LENGTH = 160

const DishView: FC<IProps> = ({ dish, className }): JSX.Element => {
	const [descriptionExpanded, setDescriptionExpanded] = useState(false)

	const description = dish.description ?? ''
	const isLongDescription = description.length > DESCRIPTION_COLLAPSED_LENGTH
	const visibleDescription =
		isLongDescription && !descriptionExpanded
			? description.slice(0, DESCRIPTION_COLLAPSED_LENGTH).trimEnd() + '…'
			: description

	return (
		<div className={cn('flex', className)}>
			<div className="flex justify-center items-center bg-secondary w-[400px] shrink-0 p-10">
				<Image
					width={280}
					height={280}
					src={dish.imageUrl}
					alt={dish.name}
					className="w-[280px] h-[280px] object-contain"
				/>
			</div>

			<div className="flex-1 p-7 space-y-4 max-h-[600px] overflow-auto scrollbar">
				<Title text={dish.name} size="md" className="font-extrabold" />

				<div className="flex items-baseline gap-3">
					<span className="text-2xl font-bold">{Math.round(dish.price / 100)} ₽</span>
					<span className="text-sm text-gray-400">{dish.weight} г</span>
				</div>

				{dish.allergens.length > 0 && (
					<div>
						<p className="text-sm font-semibold text-gray-500 mb-2">Аллергены</p>
						<div className="flex flex-wrap gap-2">
							{dish.allergens.map(allergen => (
								<span
									key={allergen.id}
									className="text-xs px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-600">
									{allergen.name}
								</span>
							))}
						</div>
					</div>
				)}

				{description && (
					<div>
						<p className="text-sm font-semibold text-gray-500 mb-1">Описание</p>
						<p className="text-sm text-gray-700 whitespace-pre-line">{visibleDescription}</p>
						{isLongDescription && (
							<button
								type="button"
								onClick={() => setDescriptionExpanded(prev => !prev)}
								className="text-sm text-primary mt-1 underline">
								{descriptionExpanded ? 'Свернуть' : 'Показать полностью'}
							</button>
						)}
					</div>
				)}

				{dish.ingredients.length > 0 && (
					<div>
						<p className="text-sm font-semibold text-gray-500 mb-2">Состав</p>
						<div className="grid grid-cols-3 gap-3">
							{dish.ingredients.map(ingredient => (
								<DishIngredientCard
									key={ingredient.id}
									name={ingredient.name}
									imageUrl={ingredient.imageUrl}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default DishView
