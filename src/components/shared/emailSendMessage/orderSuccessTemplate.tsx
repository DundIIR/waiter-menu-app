import { CartItemDTO } from '@/types/cart.dto'
import { CartItem } from '@prisma/client'
import * as React from 'react'

interface EmailTemplateProps {
	orderId: number
	items: CartItemDTO[]
}

export function OrderSuccessTemplate({ orderId, items }: EmailTemplateProps) {
	return (
		<div>
			<h1>Спасибо за заказ!</h1>

			<p>Ваш заказ №{orderId} оплачен. Список товаров:</p>

			<ul>
				{items.map(item => (
					<li key={item.id}>
						{item.productItem.product.name} | {item.productItem.price} ₽ x {item.quantity} шт. ={' '}
						{item.productItem.price * item.quantity} ₽
					</li>
				))}
			</ul>
		</div>
	)
}
