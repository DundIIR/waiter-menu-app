import { Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/providers'

const nunito = Nunito({
	variable: '--font-nunito',
	subsets: ['cyrillic'],
	weight: ['400', '500', '600', '700', '800', '900'],
})

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ru">
			<head>
				<link rel="icon" href="/public/logo.ico" />
			</head>
			<body className={`${nunito.className} antialiased scrollbar`}>
				{/* Фоновое изображение временно отключено
				<div
					className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: 'url(/background.jpg)' }}
				/> */}
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
