import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({ totalAmount: 0, items: [] })
}

export async function POST() {
	return NextResponse.json({ message: 'Корзина отключена' }, { status: 410 })
}
