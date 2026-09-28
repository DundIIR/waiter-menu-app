'use server'

import { TCheckoutForm } from '@/components/shared/checkout/schemas/checkoutFormSchema'
import { prisma } from '../../prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { sendEmail } from '@/components/shared/emailSendMessage/sendEmail'
import { GetServerSession } from '@/lib/getServerSession'
import { hashSync } from 'bcrypt'
import { VerificationUserTemplate } from '@/components/shared/emailSendMessage/verificationUserTemplate'
import { unknown } from 'zod'

export async function createOrder(data: TCheckoutForm): Promise<string | undefined> {
	console.error('[CREATE_ORDER_DISABLED] Оформление заказа отключено на этом этапе', data)
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
