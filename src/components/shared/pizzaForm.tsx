import { FC, JSX, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Ingredient as IIngredient, ProductItem } from '@prisma/client'
import { Title } from '@/components/ui/title'
import { Button } from '../ui/button'
import PizzaImage from './pizzaImage'
import GroupVariants from './groupVariants'
import { mapPizzaSize, mapPizzaType, pizzaSizes, pizzaTypes } from '@/constants/pizza'
import { IPizzaSize, IPizzaType } from '@/types/prisma'
import Ingredient from './ingredient'
import { useSet } from 'react-use'
import { calcTotalPizzaPrice, getAvailablePizzaTypes } from '@/lib'

interface IProps {
	imageUrl: string
	name: string
	ingredients: IIngredient[]
	additionalIngredients: IIngredient[]
	variations: ProductItem[]
	loading?: boolean
	onClickAdd: (itemId: number, ingredients: number[]) => void
	className?: string
}

const PizzaForm: FC<IProps> = ({
	imageUrl,
	name,
	ingredients,
	additionalIngredients,
	variations,
	loading,
	onClickAdd,
	className,
}): JSX.Element => {
	const [size, setSize] = useState<IPizzaSize>('MEDIUM')
	const [type, setType] = useState<IPizzaType>('REGULAR')

	const [selectedIngredients, { toggle: toggleIngredients }] = useSet(new Set<number>([]))

	const textDetails = `${mapPizzaSize[size]} пицца, ${mapPizzaType[type]} тесто, 520 г`

	const textIngredients = ingredients.map(item => item.name).join(', ')

	const totalPrice = calcTotalPizzaPrice(
		variations,
		additionalIngredients,
		selectedIngredients,
		size,
		type,
	)

	const availablePizzaTypes = getAvailablePizzaTypes(variations, size)

	// Обновляем выбранный тип, если он не доступен
	useEffect(() => {
		const currentType = availablePizzaTypes.find(item => item.value === type)
		if (!currentType || currentType.disabled) {
			const firstEnabled = availablePizzaTypes.find(item => !item.disabled)
			if (firstEnabled) {
				setType(firstEnabled.value as IPizzaType)
			}
		}
	}, [availablePizzaTypes, type])

	const currentItemId = variations.find(item => item.pizzaType === type && item.size === size)?.id

	return (
		<div className={cn('flex flex-1', className)}>
			<PizzaImage imageUrl={imageUrl} size={size} />

			<div className="w-[450px] bg-[#f7f6f5] p-7 space-y-1">
				<Title text={name} size="md" className="font-extrabold" />

				<p className="text-gray-400 text-sm">{textDetails}</p>
				<p className="text-gray-700 text-sm max-h-[60px] overflow-hidden text-ellipsis line-clamp-2">
					{textIngredients}
				</p>

				<GroupVariants
					items={pizzaSizes}
					value={size}
					onClick={value => setSize(value as IPizzaSize)}
				/>

				<GroupVariants
					items={availablePizzaTypes}
					value={type}
					onClick={value => setType(value as IPizzaType)}
				/>

				<Title text={'Добавить по вкусу'} size="sm" className="font-extrabold mt-5" />
				<div className="bg-[#f3f3f7b0] p-5 rounded-md h-[380px] overflow-auto scrollbar ">
					<div className="grid grid-cols-3 gap-3">
						{additionalIngredients.map(ingredient => (
							<Ingredient
								key={ingredient.id}
								name={ingredient.name}
								price={ingredient.price}
								imageUrl={ingredient.imageUrl}
								onClick={() => toggleIngredients(ingredient.id)}
								active={selectedIngredients.has(ingredient.id)}
							/>
						))}
					</div>
				</div>

				<Button
					loading={loading}
					onClick={() => {
						if (currentItemId) onClickAdd(currentItemId, Array.from(selectedIngredients))
					}}
					className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
					Добавить в корзину за {totalPrice} ₽
				</Button>
			</div>
		</div>
	)
}

export default PizzaForm
