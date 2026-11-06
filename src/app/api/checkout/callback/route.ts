import { PaymentData } from '@/types/yookassa'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma/prisma-client'
import { OrderStatus } from '@prisma/client'
import { CartItemDTO } from '@/types/cart.dto'
import { sendEmail } from '@/components/shared/emailSendMessage/sendEmail'
import { OrderSuccessTemplate } from '@/components/shared/emailSendMessage/orderSuccessTemplate'
import axios from 'axios'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const paymentId = body?.object?.id
		if (body?.type !== 'notification' || typeof paymentId !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(paymentId)) {
			return NextResponse.json({ message: 'Некорректное уведомление' }, { status: 400 })
		}
		const username = process.env.YOOKASSA_STORE_ID
		const password = process.env.YOOKASSA_API_KEY
		if (!username || !password) return NextResponse.json({ message: 'Платёжный сервис не настроен' }, { status: 503 })
		const { data: payment } = await axios.get<PaymentData & { metadata: { order_id: string; email: string } }>(
			`https://api.yookassa.ru/v3/payments/${paymentId}`,
			{ auth: { username, password }, timeout: 10000 },
		)
		if (payment.id !== paymentId || !['succeeded', 'canceled'].includes(payment.status) || body.event !== `payment.${payment.status}`) {
			return NextResponse.json({ message: 'Статус платежа не подтверждён' }, { status: 400 })
		}
		const orderId = Number(payment.metadata?.order_id)
		if (!Number.isSafeInteger(orderId) || orderId <= 0) return NextResponse.json({ message: 'Некорректный заказ' }, { status: 400 })

		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
				paymentId,
			},
		})

		if (!order) {
			return NextResponse.json({ message: 'Нет такого заказа' }, { status: 404 })
		}

		const isSucceeded = payment.status === 'succeeded' && payment.paid
		if (payment.status === 'succeeded' && !payment.paid) return NextResponse.json({ message: 'Платёж не подтверждён' }, { status: 400 })

		const updated = await prisma.order.updateMany({
			where: {
				id: orderId,
				paymentId,
				status: OrderStatus.PENDING,
			},
			data: {
				status: isSucceeded ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED,
			},
		})
		if (updated.count === 0) return NextResponse.json({ message: 'OK' })

		const items = JSON.parse(order?.items as string) as CartItemDTO[]
		if (isSucceeded) {
			await sendEmail(
				payment.metadata.email,
				'Next Pizza | Заказ успешно оплачен',
				OrderSuccessTemplate({ orderId: order?.id ?? -1, items }),
			)
		} else {
			// TODO письмо о не успешной оплате
		}

		return NextResponse.json({ message: 'OK' })
	} catch (error) {
		console.error('[CHECKOUT_CALLBACK_ERROR] Ошибка обработки уведомления')

		return NextResponse.json({ message: 'Server error' }, { status: 500 })
	}
}
