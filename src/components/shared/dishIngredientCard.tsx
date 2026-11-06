import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'

interface IProps {
	imageUrl: string
	name: string
	className?: string
}

const DishIngredientCard: FC<IProps> = ({ imageUrl, name, className }): JSX.Element => {
	return (
		<div
			className={cn(
				'flex items-center flex-col p-2 rounded-md text-center bg-white border border-gray-100 shadow-sm',
				className,
			)}>
			<img width={70} height={70} src={imageUrl} alt={name} className="object-contain" />
			<span className="text-xs mt-1">{name}</span>
		</div>
	)
}

export default DishIngredientCard
