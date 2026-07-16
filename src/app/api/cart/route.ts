import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/prisma-client'
import { findOrCreateCart } from '@/lib/findOrCreateCart'
import { CreateCartItemValues } from '@/types/cart.dto'
import { updateCartTotalAmount } from '@/lib/updateCartTotalAmount'

export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get('cartToken')?.value

		if (!token) {
			return NextResponse.json({ totalAmount: 0, items: [] })
		}

		const userCart = await prisma.cart.findFirst({
			where: {
				OR: [{ token }],
			},
			include: {
				items: {
					orderBy: {
						createdAt: 'desc',
					},
					include: {
						productItem: {
							include: {
								product: true,
							},
						},
						ingredients: true,
					},
				},
			},
		})

		return NextResponse.json(userCart)
	} catch (error) {
		console.log('[CART_GET] Server error', error)
		return NextResponse.json({ message: 'Не удалось получить корзину' }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		let token = req.cookies.get('cartToken')?.value

		if (!token) {
			token = crypto.randomUUID()
		}

		const userCart = await findOrCreateCart(token)
		const data = (await req.json()) as CreateCartItemValues

		const cartItems = await prisma.cartItem.findMany({
			where: { cartId: userCart.id, productItemId: data.productId },
			include: { ingredients: true },
		})

		const findCartItem = cartItems.find(item => {
			const existingIds = item.ingredients
				.map(i => i.id)
				.sort()
				.join(',')
			const newIds = (data.ingredientsIds ?? []).sort().join(',')
			return existingIds === newIds
		})

		// const findCartItem = await prisma.cartItem.findFirst({
		// 	where: {
		// 		cartId: userCart.id,
		// 		productItemId: data.productId,
		// 		AND: [
		// 			// совпадает по количеству ингредиентов
		// 			{ ingredients: { length: data.ingredientsIds?.length ?? 0 } },
		// 			// и каждый ингредиент совпадает
		// 			{
		// 				ingredients: {
		// 					every: {
		// 						id: { in: data.ingredientsIds ?? [] },
		// 					},
		// 				},
		// 			},
		// 		],
		// 	},
		// })

		if (findCartItem) {
			await prisma.cartItem.update({
				where: {
					id: findCartItem.id,
				},
				data: {
					quantity: findCartItem.quantity + 1,
				},
			})
		} else {
			await prisma.cartItem.create({
				data: {
					cartId: userCart.id,
					productItemId: data.productId,
					quantity: 1,
					ingredients: {
						connect: data.ingredientsIds?.map(id => ({ id })),
					},
				},
			})
		}

		const updatedUserCart = await updateCartTotalAmount(token)

		const resp = NextResponse.json(updatedUserCart)
		resp.cookies.set({ name: 'cartToken', value: token, httpOnly: true, secure: true })
		return resp
	} catch (error) {
		console.log('[CART_POST] Server error', error)
		return NextResponse.json({ message: 'Не удалось создать корзину' }, { status: 500 })
	}
}
