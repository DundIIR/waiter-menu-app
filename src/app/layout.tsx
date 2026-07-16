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
				<link rel="icon" href="https://dodopizza.ru/favicon-48x48.png" />
			</head>
			<body className={`${nunito.className} antialiased scrollbar`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
