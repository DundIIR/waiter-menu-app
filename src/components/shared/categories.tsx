'use client'
import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { useCategoryStore } from '@/store/category'

interface IProps {
	className?: string
}

const Categories: FC<IProps> = ({ className }): JSX.Element => {
	const { activeId, categories } = useCategoryStore()

	return (
		<div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
			{categories.map(category => (
				<a
					key={category.id}
					className={cn(
						'flex items-center font-bold h-11 rounded-2xl px-5',
						activeId === category.id && 'bg-white shadow-md shadow-gray-200 text-primary',
					)}
					href={`#${category.name}`}>
					{category.name}
				</a>
			))}
		</div>
	)
}

export default Categories
