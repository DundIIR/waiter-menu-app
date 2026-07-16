import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Title } from '../ui/title'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Ingredient } from '@prisma/client'

interface IProps {
	id: number
	name: string
	price: number
	imageUrl: string
	ingredients: Ingredient[]
	className?: string
}

const ProductCard: FC<IProps> = ({
	id,
	name,
	price,
	imageUrl,
	ingredients,
	className,
}): JSX.Element => {
	const router = useRouter()

	return (
		<Link href={`/product/${id}`} prefetch className={cn('cursor-pointer', className)}>
			<div className="flex justify-center items-center p-6 bg-secondary rounded-lg h-[260px] overflow-hidden group">
				<Image
					width={215}
					height={215}
					src={imageUrl}
					alt="pizza"
					className="w-[215px] h-[215px] object-contain translate-y-2 transition-transform duration-150 ease-out group-hover:scale-110 group-hover:-translate-y-0"
				/>
			</div>
			<Title text={name} size="sm" className="mb-1 mt-3 font-bold" />
			<p className="text-sm text-gray-400">{ingredients.map(item => item.name).join(', ')}</p>

			<div className="flex justify-between items-center mt-4">
				<span className="text-[20px]">
					<b>от {price} ₽</b>
				</span>

				{/* {count ? (
						<span value={count} size="lg" />
					) : ( */}
				<Button variant="secondary">
					<Plus size={16} className=" mr-1" />
					Добавить
				</Button>
				{/* )} */}
			</div>
		</Link>
	)
}

export default ProductCard
