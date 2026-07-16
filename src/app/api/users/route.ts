import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/../prisma/prisma-client'
import Error from 'next/error'

export async function GET() {
	const users = await prisma.user.findMany()
	return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		if (!body.email || !body.fullName || !body.password) {
			return NextResponse.json(
				{ message: 'Ошибка при создании пользователя', error: 'Некорректные данные' },
				{ status: 400 },
			)
		}

		const newUser = await prisma.user.create({
			data: body,
		})
		return NextResponse.json(newUser)
	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{ message: 'Ошибка при создании пользователя', error: 'Неизвестная ошибка' },
			{ status: 400 },
		)
	}
}
