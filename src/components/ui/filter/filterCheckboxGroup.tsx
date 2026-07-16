'use client'

import { FC, JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import FilterCheckbox, { IFilterCheckbox } from './filterCheckbox'
import { Input } from '../input'
import { Skeleton } from '../skeleton'

type Item = IFilterCheckbox

interface IProps {
	title?: string
	items: Item[]
	defaultItems?: Item[]
	limit?: number
	searchInputPlaceholder?: string
	onClickCheckbox?: (id: string) => void
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

	return (
		<div className={cn('', className)}>
			{title && <p className="font-bold mb-3">{title}</p>}
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
