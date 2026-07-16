import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma/prisma-client'

export async function GET(req: NextRequest) {
	const query = req.nextUrl.searchParams.get('query') || ''
	const limit = req.nextUrl.searchParams.get('limit') || ''

	const products = await prisma.product.findMany({
		where: { name: { contains: query, mode: 'insensitive' } },
		take: limit ? parseInt(limit) : 10,
	})

	return NextResponse.json(products)
}
