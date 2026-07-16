'use client'

import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { Title } from '../ui/title'
import { Input } from '../ui/input'
import { RangeSlider } from '../ui/filter/rangeSlider'
import FilterCheckboxGroup from '../ui/filter/filterCheckboxGroup'
import { useFilterIngredients } from '@/hooks/use-ingredients'
import { useFilters } from '@/hooks/use-filters'
import { pizzaSizes, pizzaTypes } from '@/constants/pizza'

interface IProps {
	className?: string
}

const Filters: FC<IProps> = ({ className }): JSX.Element => {
	const { ingredientOptions } = useFilterIngredients()
	const {
		selectedIngredients,
		selectedSizes,
		selectedTypes,
		price,
		setIngredients,
		setSizes,
		setTypes,
		setPrice,
		updatePrice,
	} = useFilters()

	return (
		<div className={cn('my-5', className)}>
			<Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

			{/* Верхние чекбоксы */}
			<div className="flex flex-col gap-4">
				<FilterCheckboxGroup
					nameGroup="sizes"
					title="Размер пиццы"
					items={pizzaSizes.map(size => ({ text: size.name, value: size.value }))}
					onClickCheckbox={setSizes}
					values={selectedSizes}
				/>
				<FilterCheckboxGroup
					nameGroup="types"
					title="Тип теста"
					items={pizzaTypes.map(type => ({ text: type.name, value: type.value }))}
					onClickCheckbox={setTypes}
					values={selectedTypes}
				/>
			</div>

			{/* Фильтрация цены */}
			<div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
				<p className="font-bold mb-3">Цена от и до:</p>
				<div className="flex gap-3 mb-5">
					<Input
						type="number"
						placeholder="0"
						min={100}
						max={5000}
						value={price.priceFrom ?? 0}
						onChange={e => updatePrice('priceFrom', Number(e.target.value))}
					/>
					<Input
						type="number"
						min={100}
						max={5000}
						placeholder="5000"
						value={price.priceTo ?? 5000}
						onChange={e => updatePrice('priceTo', Number(e.target.value))}
					/>
				</div>
				<RangeSlider
					min={100}
					max={5000}
					step={10}
					value={[price.priceFrom ?? 0, price.priceTo ?? 5000]}
					onValueChange={([priceFrom, priceTo]) => setPrice({ priceFrom, priceTo })}
				/>
			</div>

			{/* Нижние чекбоксы */}
			<div className="my-5">
				<FilterCheckboxGroup
					title={'Ингредиенты:'}
					nameGroup="ingredients"
					items={ingredientOptions}
					defaultItems={ingredientOptions.slice(0, 5)}
					onClickCheckbox={setIngredients}
					values={selectedIngredients}
				/>
			</div>
		</div>
	)
}

export default Filters
