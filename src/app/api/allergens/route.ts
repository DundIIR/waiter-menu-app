import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/prisma-client'
import { GetServerSession } from '@/lib/getServerSession'

export async function GET() {
	const res = await prisma.allergen.findMany()

	return NextResponse.json(res)
}

export async function POST(req: NextRequest) {
	const user = await GetServerSession()

	if (user?.role !== 'ADMIN') {
		return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
	}

	const body = await req.json()

	if (!body.name) {
		return NextResponse.json({ error: 'name обязателен' }, { status: 400 })
	}

	const allergen = await prisma.allergen.create({ data: { name: body.name } })

	return NextResponse.json(allergen)
}
