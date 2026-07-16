import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { Checkbox } from '../checkbox'

export interface IFilterCheckbox {
	text: string
	value: string
	endAdornment?: React.ReactNode
	onCheckedChange?: (checked: boolean) => void
	checked?: boolean
	className?: string
	nameGroup?: string
}

const FilterCheckbox: FC<IFilterCheckbox> = ({
	text,
	value,
	endAdornment,
	onCheckedChange,
	checked,
	className,
	nameGroup,
}): JSX.Element => {
	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<Checkbox
				onCheckedChange={onCheckedChange}
				checked={checked}
				value={value}
				className="rounded-[8px] w-6 h-6"
				id={`checkbox-${String(nameGroup)}-${String(value)}`}
			/>
			<label
				htmlFor={`checkbox-${String(nameGroup)}-${String(value)}`}
				className="leading-none cursor-pointer flex-1">
				{text}
			</label>
			{endAdornment}
		</div>
	)
}

export default FilterCheckbox
