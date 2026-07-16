import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma/prisma-client'

export async function GET(req: NextRequest) {
	try {
		const code = req.nextUrl.searchParams.get('code')

		if (!code) {
			throw NextResponse.json({ error: 'Неверный код' }, { status: 400 })
		}

		const verificationCode = await prisma.verificationCode.findFirst({
			where: {
				code,
			},
		})

		if (!verificationCode) {
			throw NextResponse.json({ error: 'Неверный код' }, { status: 400 })
		}

		if (Date.now() > verificationCode.expireAt.getTime()) {
			throw NextResponse.json({ error: 'Код истек' }, { status: 400 })
		}

		await prisma.user.update({
			where: {
				id: verificationCode.userId,
			},
			data: {
				verified: new Date(),
			},
		})

		await prisma.verificationCode.delete({
			where: {
				id: verificationCode.id,
			},
		})

		return NextResponse.redirect(new URL('/?verified=true', req.url))
	} catch (error) {
		console.error('[VERIFY_GET]', error)
	}
}
