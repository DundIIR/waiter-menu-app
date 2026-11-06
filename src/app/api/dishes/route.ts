import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/../prisma/prisma-client'

export async function GET(request: NextRequest) {
	const query = (request.nextUrl.searchParams.get('query') ?? '').trim().slice(0, 100)
	const dishes = await prisma.dish.findMany({
		where: { isPublished: true, name: { contains: query, mode: 'insensitive' } },
		include: { ingredients: true, allergens: true },
		orderBy: { name: 'asc' },
		take: 50,
	})
	return NextResponse.json(dishes, { headers: { 'Cache-Control': 'no-store' } })
}
