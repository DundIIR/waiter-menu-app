'use client'

import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { Title } from '../ui/title'
import ProductCard from './productCard'
import { useActiveCategory } from '@/hooks/use-active-category'
import { DishWithRelations } from '@/types/prisma'

interface IProps {
	title: string
	products: DishWithRelations[]
	categoryId: number
	className?: string
	listClassName?: string
}

const ProductsGroupList: FC<IProps> = ({
	title,
	products,
	categoryId,
	className,
	listClassName,
}): JSX.Element => {
	const sectionRef = useActiveCategory(categoryId)

	return (
		<div
			className={cn('', className)}
			id={title}
			ref={sectionRef}
			style={{ scrollMarginTop: '100px' }}>
			<Title text={title} size={'lg'} className="font-extrabold mb-5" />

			<div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
				{products.map(product => (
					<ProductCard key={product.id} dish={product} variant="filled" />
				))}
			</div>
		</div>
	)
}

export default ProductsGroupList
