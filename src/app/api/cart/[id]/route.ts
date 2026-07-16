import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma/prisma-client'
import { updateCartTotalAmount } from '@/lib/updateCartTotalAmount'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id: idStr } = await params
		const id: number = Number(idStr)

		const data = (await req.json()) as { quantity: number }
		const token = req.cookies.get('cartToken')?.value

		if (!token) {
			return NextResponse.json({ error: 'Нет токена корзины' })
		}

		const cartItem = await prisma.cartItem.findFirst({
			where: {
				id,
			},
		})

		if (!cartItem) {
			return NextResponse.json({ error: 'Не найден товар в корзине' })
		}

		await prisma.cartItem.update({
			where: {
				id,
			},
			data: {
				quantity: data.quantity,
			},
		})

		const updatedUserCart = await updateCartTotalAmount(token)

		return NextResponse.json(updatedUserCart)
	} catch (error) {
		console.log('[CART_PATCH] Server error', error)
		return NextResponse.json({ message: 'Не удалось обновить корзину' }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id: idStr } = await params
		const id: number = Number(idStr)
		const token = req.cookies.get('cartToken')?.value

		if (!token) {
			return NextResponse.json({ error: 'Нет токена корзины' })
		}

		const cartItem = await prisma.cartItem.findFirst({
			where: {
				id,
			},
		})

		if (!cartItem) {
			return NextResponse.json({ error: 'Не найден товар в корзине' })
		}

		await prisma.cartItem.delete({
			where: {
				id,
			},
		})

		const updatedUserCart = await updateCartTotalAmount(token)

		return NextResponse.json(updatedUserCart)
	} catch (error) {
		console.log('[CART_DELETE] Server error', error)
		return NextResponse.json({ message: 'Не удалось обновить корзину' }, { status: 500 })
	}
}
