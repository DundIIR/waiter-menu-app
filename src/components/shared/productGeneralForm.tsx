'use client'

import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { ProductWithRelations } from '@/types/prisma'
import { useCartStore } from '@/store'
import toast from 'react-hot-toast'
import PizzaForm from './pizzaForm'
import ProductForm from './productForm'
import { useFilterIngredients } from '@/hooks/use-ingredients'
import { useIngredientStore } from '@/store/ingredient'

interface IProps {
	product: ProductWithRelations
	onSubmit?: () => void
	className?: string
}

const ProductGeneralForm: FC<IProps> = ({ product, onSubmit, className }): JSX.Element => {
	const firstProduct = product.variations[0]
	const isPizzaForm = firstProduct?.pizzaType

	// TODO ВЫНЕСТИ В ОБЩИЕ ИНГРЕДИЕНТЫ В СТОР И ЗАПОЛНЯТЬ ИХ ИЗ ФИЛЬТРОВ
	const { ingredients } = useIngredientStore()

	const { loading, addCartItem } = useCartStore()

	const onAddProduct = async () => {
		try {
			await addCartItem({
				productId: firstProduct.id,
			})
			toast.success('Продукт добавлен в корзину')
			onSubmit?.()
		} catch (error) {
			toast.error('Не удалось добавить продукт в корзину')
			console.error(error)
		}
	}
	const onAddPizza = async (productItemId: number, ingredients: number[]) => {
		try {
			await addCartItem({
				productId: productItemId,
				ingredientsIds: ingredients,
			})
			toast.success('Пицца добавлена в корзину')
			onSubmit?.()
		} catch (error) {
			toast.error('Не удалось добавить пиццу в корзину')
			console.error(error)
		}
	}

	return (
		<div className={cn('w-full', className)}>
			{isPizzaForm ? (
				<PizzaForm
					name={product.name}
					imageUrl={product.imageUrl}
					ingredients={product.ingredients}
					additionalIngredients={ingredients}
					variations={product.variations}
					onClickAdd={onAddPizza}
					loading={loading}
				/>
			) : (
				<ProductForm
					name={product.name}
					imageUrl={product.imageUrl}
					price={firstProduct.price}
					onClickAdd={onAddProduct}
					loading={loading}
				/>
			)}
		</div>
	)
}

export default ProductGeneralForm
