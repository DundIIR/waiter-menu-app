'use client'
import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { useCategoryStore } from '@/store/category'

interface IProps {
	className?: string
}

const Categories: FC<IProps> = ({ className }): JSX.Element => {
	const { activeId, categories, disabled } = useCategoryStore()

	return (
		<div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
			{categories.map(category => (
				<a
					key={category.id}
					className={cn(
						'flex items-center font-bold h-11 rounded-2xl px-5',
						// строка остаётся на месте, чтобы вёрстка не прыгала, но вести из неё некуда
						disabled
							? 'text-gray-300 pointer-events-none'
							: activeId === category.id && 'bg-white shadow-md shadow-gray-200 text-primary',
					)}
					aria-disabled={disabled || undefined}
					href={disabled ? undefined : `#${category.name}`}>
					{category.name}
				</a>
			))}
		</div>
	)
}

export default Categories
