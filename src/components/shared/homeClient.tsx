'use client'

import { Container } from '@/components/shared/container'
import Filters from '@/components/shared/filters'
import ProductCard from '@/components/shared/productCard'
import ProductsGroupList from '@/components/shared/productsGroupList'
import TopBar from '@/components/shared/topBar'
import { Title } from '@/components/ui/title'
import { Suspense, useEffect } from 'react'
import { Category, Prisma } from '@prisma/client'
import { useCategoryStore } from '@/store/category'
import Stories from './stories'

type CategoryWithProducts = Prisma.CategoryGetPayload<{
	include: {
		products: {
			include: {
				variations: true
				ingredients: true
			}
		}
	}
}>

export default function HomeClient({ categories }: { categories: CategoryWithProducts[] }) {
	const { setCategories } = useCategoryStore()

	useEffect(() => {
		setCategories(categories.filter(cat => cat.products.length > 0))
	}, [categories, setCategories])

	return (
		<>
			<Container className="mt-10">
				<Title text="Все пиццы" size="lg" className="font-extrabold" />
			</Container>
			<TopBar />

			<Stories />

			<Container>
				<div className="flex gap-[60px]">
					{/* Фильтрация */}
					<div className="w-[250px]">
						<Suspense>
							<Filters />
						</Suspense>
					</div>

					{/* Список товаров */}
					<div className="flex-1 mb-20">
						<div className="flex flex-col gap-16">
							{categories.map(
								category =>
									category.products.length > 0 && (
										<ProductsGroupList
											key={category.id}
											title={category.name}
											products={category.products}
											categoryId={category.id}
										/>
									),
							)}
						</div>
					</div>
				</div>
			</Container>
		</>
	)
}
