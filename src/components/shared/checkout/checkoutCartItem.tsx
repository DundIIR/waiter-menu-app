'use client'

import React from 'react'
import { Trash2Icon, X } from 'lucide-react'
import { CartItemProps } from '../cartItemDetails/cart-item-details.types'
import { cn } from '@/lib/utils'
import * as CartItem from '@/components/shared/cartItemDetails'

interface Props extends CartItemProps {
	onClickCountButton?: (type: 'plus' | 'minus') => void
	onClickRemoveButton?: () => void
	className?: string
}

export const CheckoutCartItem: React.FC<Props> = ({
	name,
	price,
	imageUrl,
	quantity,
	details,
	className,
	disabled,
	onClickCountButton,
	onClickRemoveButton,
}) => {
	return (
		<div
			className={cn(
				'flex items-center justify-between',
				{
					'opacity-50 pointer-events-none': disabled,
				},
				className,
			)}>
			<div className="flex items-center gap-5 flex-1">
				<CartItem.Image src={imageUrl} />
				<CartItem.Info name={name} details={details} classNameDetails="w-[70%]" />
			</div>

			<CartItem.Price value={price} />

			<div className="flex items-center gap-5 ml-20">
				<CartItem.CountButton onClick={onClickCountButton} value={quantity} />
				<Trash2Icon
					onClick={onClickRemoveButton}
					className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-150"
					size={18}
				/>
			</div>
		</div>
	)
}
