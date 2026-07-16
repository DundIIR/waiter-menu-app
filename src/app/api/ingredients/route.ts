import { NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/prisma-client'

export async function GET() {
	const res = await prisma.ingredient.findMany()

	return NextResponse.json(res)
}
