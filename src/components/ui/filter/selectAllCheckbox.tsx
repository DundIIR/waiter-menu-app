'use client'

import { FC, JSX } from 'react'
import FilterCheckbox from './filterCheckbox'

interface IProps {
	/** Значения, которых касается действие — обычно видимый (отфильтрованный) список */
	values: string[]
	selected?: Set<string>
	onToggleAll: (values: string[], selected: boolean) => void
	nameGroup?: string
	className?: string
}

/**
 * Три состояния:
 *  — ничего не выбрано: пустой чекбокс, «Выбрать все»  → выделяет все
 *  — выбрана часть:     indeterminate,   «Снять выбор» → снимает выделение
 *  — выбраны все:       галочка,         «Снять выбор» → снимает выделение
 */
const SelectAllCheckbox: FC<IProps> = ({
	values,
	selected,
	onToggleAll,
	nameGroup,
	className,
}): JSX.Element => {
	const selectedCount = values.filter(value => selected?.has(value)).length
	const allSelected = values.length > 0 && selectedCount === values.length
	const hasSelection = selectedCount > 0

	return (
		<FilterCheckbox
			text={hasSelection ? 'Снять выбор' : 'Выбрать все'}
			value="__all__"
			checked={allSelected ? true : hasSelection ? 'indeterminate' : false}
			onCheckedChange={() => onToggleAll(values, !hasSelection)}
			nameGroup={nameGroup}
			className={className}
		/>
	)
}

export default SelectAllCheckbox
