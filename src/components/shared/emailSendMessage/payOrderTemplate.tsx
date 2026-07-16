import * as React from 'react'

interface EmailTemplateProps {
	orderId: number
	totalAmount: number
	paymentLink: string
}

export function PayOrderTemplate({ orderId, totalAmount, paymentLink }: EmailTemplateProps) {
	return (
		<div>
			<h1>Заказ №{orderId}!</h1>

			<p>
				Оплатите заказ на сумму {totalAmount} ₽. Перейдите{' '}
				<a href={paymentLink}>по этой ссылке для оплаты заказа!</a>
			</p>
		</div>
	)
}
