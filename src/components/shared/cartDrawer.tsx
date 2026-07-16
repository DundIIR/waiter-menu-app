'use client'

import { FC, JSX, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet'
import Link from 'next/link'
import { Button } from '../ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import CartDrawerItem from './cartDrawerItem'
import { calcCountProductCart, getCartItemDetails } from '@/lib'
import Image from 'next/image'
import { Title } from '../ui/title'
import UseCart from '@/hooks/use-cart'

interface IProps {
	className?: string
}

const CartDrawer: FC<React.PropsWithChildren<IProps>> = ({ children, className }): JSX.Element => {
	const { items, totalAmount, removeCartItem, handleClickCountButton } = UseCart()

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent className="flex flex-col justify-between gap-0 pb-0 bg-[#F4F1EE]">
				{!items.length ? (
					<div className="flex flex-col flex-1 items-center justify-center w-72 mx-auto">
						<Image
							src="https://cdn.dodostatic.net/pizza-site/dist/assets/5aa5dac99a832c62f3ef..svg"
							alt="Empty cart"
							width={250}
							height={250}
						/>
						<Title size="sm" text="Корзина пустая" className="text-center font-bold my-2" />
						<p className="text-center text-neutral-500 mb-5">
							Добавьте одну пиццу, чтобы оформить заказ. А лучше две!
						</p>

						<SheetClose>
							<Button className="w-56 h-12 text-base" size="lg">
								<ArrowLeft className="w-5 mr-2" />
								Вернуться назад
							</Button>
						</SheetClose>
					</div>
				) : (
					<>
						<SheetHeader>
							<SheetTitle className="text-xl">
								В корзине <span className="font-bold">{calcCountProductCart(items)} товара</span>
							</SheetTitle>
						</SheetHeader>

						<div className="flex flex-col gap-4 overflow-auto scrollbar">
							{items.map(item => (
								<CartDrawerItem
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
								/>
							))}
						</div>

						<SheetFooter className="bg-white p-8">
							<div className="w-full">
								<div className="flex mb-4">
									<span className="flex flex-1 text-lg text-neutral-500">
										Итого
										<div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
									</span>

									<span className="font-bold text-lg">{totalAmount} ₽</span>
								</div>

								<Link href="/checkout">
									<Button
										// onClick={() => setRedirecting(true)}
										// loading={redirecting}
										type="submit"
										className="w-full h-12 text-base">
										Оформить заказ
										<ArrowRight className="w-5 ml-2" />
									</Button>
								</Link>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	)
}

export default CartDrawer
