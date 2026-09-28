'use client'

import { FC, JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import FilterCheckbox, { IFilterCheckbox } from './filterCheckbox'
import { Input } from '../input'
import { Skeleton } from '../skeleton'
import FilterModeTitle from './filterModeTitle'
import SelectAllCheckbox from './selectAllCheckbox'
import { FilterMode } from '@/store/filters'

type Item = IFilterCheckbox

interface IProps {
	title?: string
	items: Item[]
	defaultItems?: Item[]
	limit?: number
	searchInputPlaceholder?: string
	onClickCheckbox?: (id: string) => void
	/** Массовое выделение; без него кнопка «Выбрать все» не показывается */
	onToggleAll?: (values: string[], selected: boolean) => void
	/** Режим группы; без onToggleMode заголовок остаётся обычным текстом */
	mode?: FilterMode
	onToggleMode?: () => void
	defaultValue?: string[]
	values?: Set<string>
	nameGroup?: string
	className?: string
}

const FilterCheckboxGroup: FC<IProps> = ({
	title,
	items,
	defaultItems,
	limit = 5,
	searchInputPlaceholder = 'Поиск...',
	onClickCheckbox,
	onToggleAll,
	mode = 'include',
	onToggleMode,
	defaultValue,
	values,
	nameGroup,
	className,
}): JSX.Element => {
	const [showAll, setShowAll] = useState<boolean>(false)
	const [searchValue, setSearchValue] = useState('')

	const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	const list =
		!showAll && defaultItems
			? (!values?.size ? defaultItems : items)
					.reduce(
						(acc, item) => (values?.has(item.value) ? [item, ...acc] : [...acc, item]),
						[] as Item[],
					)
					.slice(0, limit)
			: items.filter(item => item.text.toLowerCase().includes(searchValue.toLowerCase()))

	// Считаем по видимому списку: при активном поиске «Выбрать все» относится
	// к найденным значениям, а не ко всей группе
	const visibleValues = list.map(item => item.value)

	const showToggleAll = showAll && Boolean(onToggleAll) && visibleValues.length > 0

	return (
		<div className={cn('', className)}>
			{title && <FilterModeTitle text={title} mode={mode} onToggleMode={onToggleMode} />}
			{showAll && (
				<div className="mb-5">
					<Input
						placeholder={searchInputPlaceholder}
						value={searchValue}
						onChange={onChangeSearch}
						className="bg-gray-50 border-none"
					/>
				</div>
			)}

			{/* Стоит над прокручиваемым списком, поэтому остаётся на месте при скролле */}
			{showToggleAll && onToggleAll && (
				<div className="mb-4 pb-4 pr-2 border-b border-b-neutral-100">
					<SelectAllCheckbox
						values={visibleValues}
						selected={values}
						onToggleAll={onToggleAll}
						nameGroup={nameGroup}
						className="font-bold"
					/>
				</div>
			)}

			<div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
				{!items.length ? (
					<LoaderList limit={limit} />
				) : (
					list.map((item, index) => (
						<FilterCheckbox
							key={index}
							text={item.text}
							value={item.value}
							endAdornment={item.endAdornment}
							checked={values?.has(item.value)}
							onCheckedChange={() => onClickCheckbox?.(item.value)}
							nameGroup={nameGroup}
						/>
					))
				)}
			</div>
			{items.length > limit && (
				<div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
					<button onClick={() => setShowAll(!showAll)} className="text-primary mt-3">
						{showAll ? 'Скрыть' : '+ Показать все'}
					</button>
				</div>
			)}
		</div>
	)
}

const LoaderList = ({ limit }: { limit?: number }) => {
	return Array(limit ?? 5)
		.fill(0)
		.map((_, index) => <Skeleton key={index} className="rounded-[8px] w-auto h-6" />)
}

export default FilterCheckboxGroup
