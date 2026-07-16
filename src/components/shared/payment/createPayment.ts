import { PaymentData } from '@/types/yookassa'
import axios from 'axios'
import { randomUUID } from 'crypto'

interface PaymentDetails {
	amount: number
	orderId: string
	description: string
	email: string
}

export const createPayment = async (details: PaymentDetails) => {
	const { data } = await axios.post<PaymentData>(
		'https://api.yookassa.ru/v3/payments',
		{
			amount: {
				value: details.amount.toFixed(2),
				currency: 'RUB',
			},
			capture: true,
			metadata: {
				order_id: details.orderId,
				email: details.email,
			},
			description: details.description,
			confirmation: {
				type: 'redirect',
				return_url: process.env.YOOKASSA_CALLBACK_URL,
			},
		},
		{
			auth: {
				username: process.env.YOOKASSA_STORE_ID as string,
				password: process.env.YOOKASSA_API_KEY as string,
			},
			headers: {
				'Idempotence-Key': randomUUID(),
				'Content-Type': 'application/json',
			},
		},
	)

	return data
}
