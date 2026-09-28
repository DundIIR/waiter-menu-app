'use client'

import { Container } from '@/components/shared/container'
import ProductsGroupList from '@/components/shared/productsGroupList'
import Filters from '@/components/shared/filters'
import TopBar from '@/components/shared/topBar'
import { Title } from '@/components/ui/title'
import { Button } from '@/components/ui/button'
import { useEffect, useMemo } from 'react'
import { useCategoryStore } from '@/store/category'
import { TOP_BAR_HEIGHT } from '@/hooks/use-active-category'
import { useFilters } from '@/hooks/use-filters'
import { FilterMode } from '@/store/filters'
import { CategoryWithDishes } from '@/types/prisma'

export default function HomeClient({ categories }: { categories: CategoryWithDishes[] }) {
	const { setCategories, setDisabled } = useCategoryStore()
	const { selectedIngredients, selectedAllergens, ingredientsMode, allergensMode, reset } =
		useFilters()

	// Фильтруем уже загруженное меню в памяти — мгновенно, без запроса на сервер
	const visibleCategories = useMemo(() => {
		const byIngredients = selectedIngredients.size > 0
		const byAllergens = selectedAllergens.size > 0

		// include: блюдо содержит хотя бы одно выбранное значение;
		// exclude: не содержит ни одного из выбранных
		const matches = (items: { id: number }[], selected: Set<string>, mode: FilterMode) => {
			const found = items.some(item => selected.has(String(item.id)))

			return mode === 'exclude' ? !found : found
		}

		const filtered =
			!byIngredients && !byAllergens
				? categories
				: categories.map(category => ({
						...category,
						dishes: category.dishes.filter(
							dish =>
								(!byIngredients ||
									matches(dish.ingredients, selectedIngredients, ingredientsMode)) &&
								(!byAllergens || matches(dish.allergens, selectedAllergens, allergensMode)),
						),
					}))

		return filtered.filter(category => category.dishes.length > 0)
	}, [categories, selectedIngredients, selectedAllergens, ingredientsMode, allergensMode])

	const isEmpty = visibleCategories.length === 0

	// Список категорий в TopBar сжимается под фильтр. Если не подошло ничего,
	// показываем полный список неактивным — иначе строка исчезает и вёрстка прыгает
	useEffect(() => {
		const fallback = categories.filter(category => category.dishes.length > 0)

		setCategories(isEmpty ? fallback : visibleCategories)
		setDisabled(isEmpty)
	}, [categories, visibleCategories, isEmpty, setCategories, setDisabled])

	return (
		<>
			<div className="bg-white">
				<Container className="py-8">
					<Title text="Меню" size="lg" className="font-extrabold" />
				</Container>
			</div>
			<TopBar />

			<Container>
				<div className="flex gap-[80px] mb-20">
					{/* self-start обязателен: иначе flex-элемент растягивается на всю
					    высоту контейнера и прилипать ему просто некуда */}
					<div
						className="w-[250px] shrink-0 self-start sticky overflow-y-auto pr-2"
						style={{
							top: TOP_BAR_HEIGHT,
							maxHeight: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
						}}>
						<Filters />
					</div>

					<div className="flex-1">
						<div className="flex flex-col gap-16">
							{isEmpty ? (
								<div className="flex flex-col items-center gap-5 py-20 text-center">
									<p className="text-gray-400">Под выбранные фильтры не подходит ни одно блюдо</p>
									<Button onClick={reset}>Посмотреть меню</Button>
								</div>
							) : (
								visibleCategories.map(category => (
									<ProductsGroupList
										key={category.id}
										title={category.name}
										products={category.dishes}
										categoryId={category.id}
									/>
								))
							)}
						</div>
					</div>
				</div>
			</Container>
		</>
	)
}
