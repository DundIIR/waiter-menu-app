'use client'

import { FC, JSX, useMemo, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '../input'
import { Popover, PopoverAnchor, PopoverContent } from '../popover'
import { Skeleton } from '../skeleton'
import FilterCheckbox from './filterCheckbox'
import SelectAllCheckbox from './selectAllCheckbox'

export interface MultiSelectOption {
	text: string
	value: string
}

interface IProps {
	options: MultiSelectOption[]
	values?: Set<string>
	onToggle?: (value: string) => void
	/** Массовое выделение; без него строка «Выбрать все» не показывается */
	onToggleAll?: (values: string[], selected: boolean) => void
	placeholder?: string
	emptyText?: string
	nameGroup?: string
	loading?: boolean
	className?: string
}

/**
 * Поле поиска, которое разворачивается в список чекбоксов.
 * Ввод в поле фильтрует список, выбранное показывается чипами под полем.
 */
const MultiSelect: FC<IProps> = ({
	options,
	values,
	onToggle,
	onToggleAll,
	placeholder = 'Поиск ...',
	emptyText = 'Ничего не найдено',
	nameGroup,
	loading = false,
	className,
}): JSX.Element => {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState('')
	const anchorRef = useRef<HTMLDivElement>(null)

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase()

		return query ? options.filter(option => option.text.toLowerCase().includes(query)) : options
	}, [options, search])

	const selected = useMemo(
		() => options.filter(option => values?.has(option.value)),
		[options, values],
	)

	// «Выбрать все» относится к тому, что сейчас видно в списке:
	// при активном поиске — только к найденному
	const visibleValues = filtered.map(option => option.value)

	return (
		<div className={cn('', className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverAnchor asChild>
					<div ref={anchorRef} className="relative">
						<Input
							value={search}
							placeholder={placeholder}
							onChange={event => {
								setSearch(event.target.value)
								setOpen(true)
							}}
							onFocus={() => setOpen(true)}
							onClick={() => setOpen(true)}
							className="bg-gray-50 border-none pr-9"
						/>
						<ChevronDown
							className={cn(
								'absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none transition-transform',
								open && 'rotate-180',
							)}
						/>
					</div>
				</PopoverAnchor>

				<PopoverContent
					align="start"
					// ширина берётся от поля поиска, а не фиксированные w-72 из PopoverContent
					className="w-[var(--radix-popover-trigger-width)] p-0"
					// фокус остаётся в поле, иначе нельзя продолжить набирать текст
					onOpenAutoFocus={event => event.preventDefault()}
					onInteractOutside={event => {
						// клик по самому полю не должен закрывать список: иначе onClick
						// тут же откроет его заново и получится мигание
						if (anchorRef.current?.contains(event.target as Node)) {
							event.preventDefault()
						}
					}}>
					{onToggleAll && visibleValues.length > 0 && (
						<div className="p-3 border-b border-b-neutral-100">
							<SelectAllCheckbox
								values={visibleValues}
								selected={values}
								onToggleAll={onToggleAll}
								nameGroup={nameGroup}
								className="font-bold"
							/>
						</div>
					)}

					<div className="flex flex-col gap-4 max-h-64 p-3 overflow-auto scrollbar">
						{loading ? (
							Array(5)
								.fill(0)
								.map((_, index) => <Skeleton key={index} className="rounded-[8px] w-auto h-6" />)
						) : filtered.length === 0 ? (
							<p className="text-sm text-gray-400">{emptyText}</p>
						) : (
							filtered.map(option => (
								<FilterCheckbox
									key={option.value}
									text={option.text}
									value={option.value}
									checked={values?.has(option.value)}
									onCheckedChange={() => onToggle?.(option.value)}
									nameGroup={nameGroup}
								/>
							))
						)}
					</div>
				</PopoverContent>
			</Popover>

			{selected.length > 0 && (
				<div className="flex flex-wrap gap-2 mt-3">
					{selected.map(option => (
						<button
							key={option.value}
							type="button"
							onClick={() => onToggle?.(option.value)}
							title="Убрать из выбранных"
							className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-gray-50 text-sm cursor-pointer hover:bg-gray-100">
							{option.text}
							<X className="size-3.5 text-gray-400" />
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default MultiSelect
