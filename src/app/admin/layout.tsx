import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Админка — Южане Горожане',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<header className="border-b">
				<div className="mx-auto max-w-[1280px] flex items-center justify-between py-6">
					<h1 className="text-xl font-bold">Админка</h1>
					<Link href="/" className="text-sm text-gray-500 hover:underline">
						← В меню
					</Link>
				</div>
			</header>
			<main className="mx-auto max-w-[1280px] py-8">{children}</main>
		</div>
	)
}
