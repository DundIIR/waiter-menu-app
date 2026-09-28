'use client'

import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { Title } from '../ui/title'
// Старая группа с чекбоксами (ui/filter/filterCheckboxGroup) осталась в проекте,
// но сайдбар теперь собран из заголовка-переключателя и мультиселекта
import FilterModeTitle from '../ui/filter/filterModeTitle'
import MultiSelect from '../ui/filter/multiSelect'
import { Button } from '../ui/button'
import { useFilterIngredients } from '@/hooks/use-ingredients'
import { useFilterAllergens } from '@/hooks/use-allergens'
import { useFilters } from '@/hooks/use-filters'

interface IProps {
	className?: string
}

const Filters: FC<IProps> = ({ className }): JSX.Element => {
	const { ingredientOptions, loading: ingredientsLoading } = useFilterIngredients()
	const { allergenOptions, loading: allergensLoading } = useFilterAllergens()
	const {
		selectedIngredients,
		selectedAllergens,
		setIngredients,
		setAllergens,
		selectIngredients,
		selectAllergens,
		ingredientsMode,
		allergensMode,
		toggleIngredientsMode,
		toggleAllergensMode,
		reset,
	} = useFilters()

	// Режимы тоже часть состояния фильтров, поэтому «по умолчанию» — это
	// пустой выбор и обе группы на включение
	const isDefault =
		selectedIngredients.size === 0 &&
		selectedAllergens.size === 0 &&
		ingredientsMode === 'include' &&
		allergensMode === 'include'

	return (
		<div className={cn('my-5', className)}>
			<Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

			<div className="border-y border-y-neutral-100 py-6">
				<FilterModeTitle
					text="Ингредиенты"
					mode={ingredientsMode}
					onToggleMode={toggleIngredientsMode}
				/>
				<MultiSelect
					nameGroup="ingredients"
					options={ingredientOptions}
					values={selectedIngredients}
					onToggle={setIngredients}
					onToggleAll={selectIngredients}
					loading={ingredientsLoading}
				/>
			</div>

			<div className="my-5">
				<FilterModeTitle text="Аллергены" mode={allergensMode} onToggleMode={toggleAllergensMode} />
				<MultiSelect
					nameGroup="allergens"
					options={allergenOptions}
					values={selectedAllergens}
					onToggle={setAllergens}
					onToggleAll={selectAllergens}
					loading={allergensLoading}
				/>
			</div>

			<Button variant="outline" onClick={reset} disabled={isDefault} className="w-full mt-2">
				Сбросить фильтры
			</Button>
		</div>
	)
}

export default Filters
