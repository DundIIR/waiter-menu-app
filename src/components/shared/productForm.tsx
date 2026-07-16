import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { Ingredient, ProductItem } from '@prisma/client'
import ProductImage from './pizzaImage'
import { Title } from '@/components/ui/title'
import { Button } from '../ui/button'

interface IProps {
	imageUrl: string
	name: string
	price: number
	loading?: boolean
	onClickAdd: () => void
	className?: string
}

const ProductForm: FC<IProps> = ({
	imageUrl,
	name,
	price,
	loading,
	onClickAdd,
	className,
}): JSX.Element => {
	return (
		<div className={cn('flex flex-1 h-full', className)}>
			<div className="flex items-center justify-center flex-1 relative w-full">
				<img
					src={imageUrl}
					alt={name}
					className="relative left-2 top-2 transition-all z-10 duration-300 w-[350px] h-[350px]"
				/>
			</div>

			<div className="w-[450px] bg-[#f7f6f5] p-7 flex flex-col justify-between">
				<div>
					<Title text={name} size="md" className="font-extrabold mb-1" />
					<p className="text-gray-700 text-sm">
						Тут должно быть описание продукта, но его не завезли. Пу-пу-пу... Тут должно быть
						описание продукта, но его не завезли. Пу-пу-пу... Тут должно быть описание продукта, но
						его не завезли. Пу-пу-пу...
					</p>
				</div>

				<Button
					loading={loading}
					onClick={onClickAdd}
					className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
					Добавить в корзину за {price} ₽
				</Button>
			</div>
		</div>
	)
}

export default ProductForm
