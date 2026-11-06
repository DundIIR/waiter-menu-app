import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname.replace(/\/+$/, '')
	if (path === '/api/dishes' && request.method === 'GET') return NextResponse.next()
	return NextResponse.json({ message: 'Маршрут недоступен' }, { status: 404 })
}

export const config = {
	matcher: ['/api/:path*', '/checkout/:path*', '/profile/:path*', '/not-auth/:path*'],
}
