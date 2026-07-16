import React from 'react'
import { Title } from '../../ui/title'
import { cn } from '@/lib/utils'

interface IProps {
	title?: string
	endAdornment?: React.ReactNode
	className?: string
	contentClassName?: string
}

export const WhiteBlock: React.FC<React.PropsWithChildren<IProps>> = ({
	title,
	endAdornment,
	className,
	contentClassName,
	children,
}) => {
	return (
		<div className={cn('bg-white rounded-3xl', className)}>
			{title && (
				<div className="flex items-center justify-between p-5 px-7 border-b border-gray-100">
					<Title text={title} size="sm" className="font-bold" />
					{endAdornment}
				</div>
			)}

			<div className={cn('px-5 py-5', contentClassName)}>{children}</div>
		</div>
	)
}
