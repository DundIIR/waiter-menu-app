import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { CheckoutCartItem, WhiteBlock } from '.'
import { getCartItemDetails } from '@/lib'
import { CartStateItem } from '@/lib/getCartDetails'
import { CheckoutItemSkeleton } from './skeleton/CheckoutItemSkeleton'

interface IProps {
	items: CartStateItem[]
	loading?: boolean
	handleClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void
	removeCartItem: (id: number) => void
	className?: string
}

export const CheckoutCart: FC<IProps> = ({
	items,
	loading,
	handleClickCountButton,
	removeCartItem,
	className,
}): JSX.Element => {
	return (
		<WhiteBlock title="1. Корзина" className={cn('', className)}>
			<div className="flex flex-col gap-5">
				{loading
					? Array(4)
							.fill(null)
							.map((_, index) => <CheckoutItemSkeleton key={index} />)
					: items.map((item, id) => (
							<CheckoutCartItem
								key={item.id}
								id={item.id}
								imageUrl={item.imageUrl}
								details={getCartItemDetails(item.ingredients, item.pizzaType, item.pizzaSize)}
								name={item.name}
								price={item.price}
								disabled={item.disabled}
								quantity={item.quantity}
								onClickCountButton={type => handleClickCountButton(item.id, item.quantity, type)}
								onClickRemoveButton={() => removeCartItem(item.id)}
								className={cn({ 'border-b border-gray-100 pb-5': id !== items.length - 1 })}
							/>
					  ))}
			</div>
		</WhiteBlock>
	)
}
