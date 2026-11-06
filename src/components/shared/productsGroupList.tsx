'use client'

import { FC, JSX, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Title } from '../ui/title'
import ProductCard from './productCard'
import { useCategoryStore } from '@/store/category'
import { ProductWithRelations } from '@/types/prisma'

interface IProps {
	title: string
	products: ProductWithRelations[]
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
	const { setActiveId } = useCategoryStore()

	const intersectionRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const element = intersectionRef.current
		if (!element || typeof IntersectionObserver === 'undefined') return

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) setActiveId(categoryId)
		}, { threshold: 0.7 })
		observer.observe(element)
		return () => observer.disconnect()
	}, [categoryId, setActiveId])

	return (
		<div
			className={cn('', className)}
			id={title}
			ref={intersectionRef}
			style={{ scrollMarginTop: '100px' }}>
			<Title text={title} size={'lg'} className="font-extrabold mb-5" />

			<div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
				{products.map(product => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						price={product.variations[0].price}
						imageUrl={product.imageUrl}
						ingredients={product.ingredients}
					/>
				))}
			</div>
		</div>
	)
}

export default ProductsGroupList
