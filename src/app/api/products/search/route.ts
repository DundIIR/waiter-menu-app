import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma/prisma-client'

export async function GET(req: NextRequest) {
	const query = req.nextUrl.searchParams.get('query') || ''
	const limit = req.nextUrl.searchParams.get('limit') || ''

	const dishes = await prisma.dish.findMany({
		where: {
			isPublished: true,
			name: { contains: query, mode: 'insensitive' },
		},
		take: limit ? parseInt(limit) : 10,
		include: {
			ingredients: true,
			allergens: true,
		},
	})

	return NextResponse.json(dishes)
}
