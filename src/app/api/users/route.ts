import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/../prisma/prisma-client'
import { GetServerSession } from '@/lib/getServerSession'
import { hash } from 'bcrypt'
import { z } from 'zod'

const publicUser = {
	id: true,
	fullName: true,
	email: true,
	role: true,
	verified: true,
	createdAt: true,
} as const

const createUserSchema = z.object({
	fullName: z.string().trim().min(1).max(200),
	email: z.string().trim().email().max(254),
	password: z.string().min(8).refine(value => Buffer.byteLength(value, 'utf8') <= 72),
}).strict()

async function authorizeAdmin() {
	const session = await GetServerSession()
	const id = Number(session?.id)
	if (!session || !Number.isSafeInteger(id) || id <= 0) return 401
	const user = await prisma.user.findUnique({ where: { id }, select: { role: true } })
	return user?.role === 'ADMIN' ? null : 403
}

export async function GET() {
	const status = await authorizeAdmin()
	if (status) return NextResponse.json({ message: 'Доступ запрещён' }, { status })
	const users = await prisma.user.findMany({ select: publicUser })
	return NextResponse.json(users, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
	const status = await authorizeAdmin()
	if (status) return NextResponse.json({ message: 'Доступ запрещён' }, { status })
	const body = await req.json().catch(() => null)
	const parsed = createUserSchema.safeParse(body)
	if (!parsed.success) return NextResponse.json({ message: 'Некорректные данные' }, { status: 400 })
	try {
		const { fullName, email, password } = parsed.data
		const user = await prisma.user.create({
			data: { fullName, email, password: await hash(password, 10) },
			select: publicUser,
		})
		return NextResponse.json(user, { status: 201, headers: { 'Cache-Control': 'no-store' } })
	} catch {
		return NextResponse.json({ message: 'Не удалось создать пользователя' }, { status: 400 })
	}
}
