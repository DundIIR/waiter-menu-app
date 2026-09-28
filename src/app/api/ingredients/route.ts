import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/prisma-client'
import { GetServerSession } from '@/lib/getServerSession'

export async function GET() {
	const res = await prisma.ingredient.findMany()

	return NextResponse.json(res)
}

export async function POST(req: NextRequest) {
	const user = await GetServerSession()

	if (user?.role !== 'ADMIN') {
		return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
	}

	const body = await req.json()

	if (!body.name || !body.imageUrl) {
		return NextResponse.json({ error: 'name и imageUrl обязательны' }, { status: 400 })
	}

	const ingredient = await prisma.ingredient.create({
		data: { name: body.name, imageUrl: body.imageUrl },
	})

	return NextResponse.json(ingredient)
}
