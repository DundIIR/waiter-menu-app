import type { Metadata } from 'next'
import Header from '@/components/shared/header'
import DishModal from '@/components/shared/modals/dishModal'

export const metadata: Metadata = {
	title: 'DoDo & Next.js',
}

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode
	modal: React.ReactNode
}>) {
	return (
		<main className="min-h-screen">
			<Header />
			{children}
			{modal}
			<DishModal />
		</main>
	)
}
