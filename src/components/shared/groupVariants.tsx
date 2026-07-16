import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'

export type Variant = {
	name: string
	value: string
	disabled?: boolean
}

interface IProps {
	items: readonly Variant[]
	onClick?: (value: Variant['value']) => void
	value?: Variant['value']
	className?: string
}

const GroupVariants: FC<IProps> = ({ items, onClick, className, value }): JSX.Element => {
	return (
		<div
			className={cn(className, 'flex justify-between bg-[#f3f3f7b0] rounded-3xl p-1 select-none')}>
			{items.map(item => (
				<button
					key={item.name}
					onClick={() => onClick?.(item.value)}
					className={cn(
						'flex items-center justify-center cursor-pointer h-[30px] px-5 flex-1 rounded-3xl transition-all duration-400 text-sm',
						{
							'bg-white shadow-md': item.value === value,
							'text-gray-500 opacity-50 pointer-events-none': item.disabled,
						},
					)}>
					{item.name}
				</button>
			))}
		</div>
	)
}

export default GroupVariants
