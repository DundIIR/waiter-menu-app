import { PaymentCallbackData } from '@/types/yookassa'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma/prisma-client'
import { Order, OrderStatus } from '@prisma/client'
import { CartItemDTO } from '@/types/cart.dto'
import { sendEmail } from '@/components/shared/emailSendMessage/sendEmail'
import { OrderSuccessTemplate } from '@/components/shared/emailSendMessage/orderSuccessTemplate'

export async function POST(req: NextResponse) {
	try {
		const body = (await req.json()) as PaymentCallbackData

		const order = await prisma.order.findFirst({
			where: {
				id: Number(body.object.metadata.order_id),
			},
		})

		if (!order) {
			return NextResponse.json({ message: 'Нет такого заказа' }, { status: 404 })
		}

		const isSucceeded = body.object.status === 'succeeded'

		await prisma.order.update({
			where: {
				id: Number(body.object.metadata.order_id),
			},
			data: {
				status: isSucceeded ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED,
			},
		})

		const items = JSON.parse(order?.items as string) as CartItemDTO[]
		console.log(body)
		if (isSucceeded) {
			await sendEmail(
				body.object.metadata.email,
				'Next Pizza | Заказ успешно оплачен',
				OrderSuccessTemplate({ orderId: order?.id ?? -1, items }),
			)
		} else {
			// TODO письмо о не успешной оплате
		}

		return NextResponse
	} catch (error) {
		console.error('[CHECKOUT_CALLBACK_ERROR]', error)

		return NextResponse.json({ message: 'Server error' }, { status: 500 })
	}
}
