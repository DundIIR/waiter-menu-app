'use server'

import { TCheckoutForm } from '@/components/shared/checkout/schemas/checkoutFormSchema'
import { prisma } from '../../prisma/prisma-client'
import { OrderStatus, Prisma } from '@prisma/client'
import { cookies } from 'next/headers'
import { sendEmail } from '@/components/shared/emailSendMessage/sendEmail'
import { PayOrderTemplate } from '@/components/shared/emailSendMessage/payOrderTemplate'
import { createPayment } from '@/components/shared/payment/createPayment'
import { GetServerSession } from '@/lib/getServerSession'
import { hashSync } from 'bcrypt'
import { VerificationUserTemplate } from '@/components/shared/emailSendMessage/verificationUserTemplate'
import { unknown } from 'zod'

export async function createOrder(data: TCheckoutForm): Promise<string | undefined> {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('cartToken')?.value

		if (!token) {
			throw new Error('Отсутствует токен корзины')
		}

		const cart = await prisma.cart.findFirst({
			where: {
				token,
			},
			include: {
				items: {
					include: {
						ingredients: true,
						productItem: {
							include: {
								product: true,
							},
						},
					},
				},
			},
		})

		if (!cart) {
			throw new Error('Корзин не найдена')
		} else if (cart.totalAmount === 0) {
			throw new Error('Корзина пустая')
		}

		const order = await prisma.order.create({
			data: {
				token: token,
				totalAmount: cart.totalAmount,
				address: data.address,
				fullName: data.lastName + ' ' + data.firstName,
				phone: data.phone,
				status: OrderStatus.PENDING,
				items: JSON.stringify(cart.items),
			},
		})

		const paymentData = await createPayment({
			amount: order.totalAmount,
			orderId: String(order.id),
			description: `Заказ №${order.id}`,
			email: data.email,
		})

		if (!paymentData) {
			throw new Error('Не удалось создать платеж')
		}

		await prisma.order.update({
			where: {
				id: order.id,
			},
			data: {
				paymentId: paymentData.id,
			},
		})

		await sendEmail(
			data.email,
			'Next Pizza | Оплата заказа',
			PayOrderTemplate({
				orderId: order.id,
				totalAmount: order.totalAmount,
				paymentLink: paymentData.confirmation.confirmation_url,
			}),
		)

		await prisma.cart.update({
			where: {
				id: cart.id,
			},
			data: {
				totalAmount: 0,
			},
		})

		await prisma.cartItem.deleteMany({
			where: {
				cartId: cart.id,
			},
		})

		return paymentData.confirmation.confirmation_url
	} catch (error) {
		console.error('[CREATE_ORDER_ERROR]', error)
	}

	return undefined
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
	try {
		const currentUser = await GetServerSession()

		if (!currentUser) {
			throw new Error('Пользователь не найден')
		}

		const findUser = await prisma.user.findFirst({
			where: {
				id: Number(currentUser.id),
			},
		})

		if (!findUser) {
			throw new Error('Пользователь не найден в базе данных')
		}

		await prisma.user.update({
			where: {
				id: Number(findUser.id),
			},
			data: {
				fullName: body.fullName,
				email: body.email,
				password: body.password ? hashSync(body.password as string, 10) : findUser.password,
			},
		})
	} catch (error) {
		console.error('[UPDATE_USER_ERROR] ', error)
	}
}

export async function registerUser(body: Prisma.UserCreateInput) {
	try {
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		})

		if (user) {
			if (!user.verified) {
				throw new Error('Почта не подтверждена')
			}

			throw new Error('Пользователь уже зарегистрирован')
		}

		const createUser = await prisma.user.create({
			data: {
				fullName: body.fullName,
				email: body.email,
				password: hashSync(body.password as string, 10),
			},
		})

		const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString()
		await prisma.verificationCode.create({
			data: {
				code: code,
				userId: createUser.id,
				expireAt: new Date(Date.now() + 5 * 60 * 1000),
			},
		})

		await sendEmail(
			createUser.email,
			'Next Pizza | Подтверждение почты',
			VerificationUserTemplate({
				code,
			}),
		)
	} catch (error) {
		const res = console.error('[REGISTER_USER_ERROR] ', error)
		throw error
	}
}
