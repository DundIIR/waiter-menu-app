import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { CircleCheck } from 'lucide-react'

interface IProps {
	imageUrl: string
	name: string
	price: number
	active?: boolean
	onClick?: () => void
	className?: string
}

const Ingredient: FC<IProps> = ({
	imageUrl,
	name,
	price,
	active,
	onClick,
	className,
}): JSX.Element => {
	return (
		<div
			className={cn(
				'flex items-center flex-col p-1 rounded-md w-28 text-center relative cursor-pointer shadow-md bg-white border border-transparent',
				{ 'border border-primary': active },
				className,
			)}
			onClick={onClick}>
			{active && <CircleCheck size={16} className="absolute top-2 right-2 text-primary" />}
			<img width={90} height={90} src={imageUrl} />
			<span className="text-xs mb-1">{name}</span>
			<span className="font-bold">{price} ₽</span>
		</div>
	)
}

export default Ingredient
