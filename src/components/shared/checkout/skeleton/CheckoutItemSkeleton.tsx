import { cn } from '@/lib/utils'
import React from 'react'

interface Props {
	className?: string
}

export const CheckoutItemSkeleton: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn('flex items-center justify-between', className)}>
			<div className="flex items-center gap-5">
				<div className="w-[50px] h-[50px] bg-gray-200 rounded-full animate-pulse" />
				<div className="space-y-2">
					<h2 className="w-55 h-5 bg-gray-200 rounded animate-pulse" />
					<h4 className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
				</div>
			</div>
			<div className="flex gap-4 items-center">
				<div className="h-5 w-10 bg-gray-200 rounded animate-pulse" />
				<div className="h-8 w-[133px] bg-gray-200 rounded animate-pulse" />
			</div>
		</div>
	)
}
