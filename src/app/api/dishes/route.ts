import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/prisma-client'
import { GetServerSession } from '@/lib/getServerSession'

export async function POST(req: NextRequest) {
	const user = await GetServerSession()

	if (user?.role !== 'ADMIN') {
		return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
	}

	const body = await req.json()

	if (!body.name || !body.imageUrl || !body.categoryId || body.price == null || body.weight == null) {
		return NextResponse.json(
			{ error: 'name, imageUrl, categoryId, price и weight обязательны' },
			{ status: 400 },
		)
	}

	const dish = await prisma.dish.create({
		data: {
			name: body.name,
			description: body.description || null,
			imageUrl: body.imageUrl,
			price: body.price,
			weight: body.weight,
			isPublished: Boolean(body.isPublished),
			categoryId: body.categoryId,
			ingredients: body.ingredientIds?.length
				? { connect: body.ingredientIds.map((id: number) => ({ id })) }
				: undefined,
			allergens: body.allergenIds?.length
				? { connect: body.allergenIds.map((id: number) => ({ id })) }
				: undefined,
		},
		include: { ingredients: true, allergens: true },
	})

	return NextResponse.json(dish)
}
