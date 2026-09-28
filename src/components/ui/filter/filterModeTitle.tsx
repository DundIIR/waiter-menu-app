'use client'

import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { FilterMode } from '@/store/filters'

interface IProps {
	text: string
	mode?: FilterMode
	/** Без обработчика заголовок остаётся обычным текстом, без кнопки режима */
	onToggleMode?: () => void
	className?: string
}

/**
 * Заголовок группы фильтров. В режиме include показывает «+ Название»
 * (оставить только блюда с выбранным), в exclude — «− Название» (убрать их).
 */
const FilterModeTitle: FC<IProps> = ({ text, mode = 'include', onToggleMode, className }): JSX.Element => {
	if (!onToggleMode) {
		return <p className={cn('font-bold mb-3', className)}>{text}</p>
	}

	const isExclude = mode === 'exclude'

	return (
		<button
			type="button"
			onClick={onToggleMode}
			aria-pressed={isExclude}
			title={
				isExclude
					? 'Блюда с выбранными значениями скрываются. Нажмите, чтобы показывать только их'
					: 'Показываются только блюда с выбранными значениями. Нажмите, чтобы скрывать их'
			}
			className={cn(
				'font-bold mb-3 flex items-center gap-2 cursor-pointer hover:opacity-70',
				className,
			)}>
			<span
				className={cn(
					'flex items-center justify-center w-5 h-5 rounded-[6px] text-white leading-none',
					isExclude ? 'bg-red-500' : 'bg-primary',
				)}>
				{isExclude ? '−' : '+'}
			</span>
			{text}
		</button>
	)
}

export default FilterModeTitle
