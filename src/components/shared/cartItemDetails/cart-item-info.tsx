import { cn } from '@/lib/utils'

interface Props {
	name: string
	details: string
	className?: string
	classNameDetails?: string
}

export const CartItemInfo: React.FC<Props> = ({ name, details, className, classNameDetails }) => {
	return (
		<div>
			<div className={cn('flex items-center justify-between', className)}>
				<h2 className="text-lg font-bold flex-1 leading-6">{name}</h2>
			</div>
			{details && (
				<p className={cn('text-xs text-gray-400 w-[90%]', classNameDetails)}>{details}</p>
			)}
		</div>
	)
}
