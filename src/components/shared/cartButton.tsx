'use client'

import { FC, JSX } from 'react'
import { Button } from '../ui/button'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import CartDrawer from './cartDrawer'
import { useCartStore } from '@/store'
import { cn } from '@/lib/utils'
import { calcCountProductCart } from '@/lib'

interface IProps {
	className?: string
}

const CartButton: FC<IProps> = ({ className }): JSX.Element => {
	const { loading, items, totalAmount } = useCartStore()

	return (
		<CartDrawer>
			<Button
				loading={loading}
				className={cn('group relative', { 'w-[105px]': loading }, className)}>
				{items.length ? (
					<>
						<b>{totalAmount} ₽</b>
						<span className="h-full w-[1px] bg-white/30 mx-3" />
						<div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
							<ShoppingCart className="h-4 w-4 relative" strokeWidth={2} />
							<b>{calcCountProductCart(items)}</b>
						</div>
					</>
				) : (
					<div className="flex gap-2">
						<b>Корзина</b>
						<div className="flex items-center gap-1 ml-1 transition duration-300 group-hover:opacity-0">
							<ShoppingCart className="h-4 w-4 relative mr-1" strokeWidth={2} />
						</div>
					</div>
				)}
				<ArrowRight className="w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
			</Button>
		</CartDrawer>
	)
}

export default CartButton
