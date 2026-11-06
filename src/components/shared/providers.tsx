'use client'

import { Toaster } from 'react-hot-toast'
import NextTopLoader from 'nextjs-toploader'

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<NextTopLoader />
			<Toaster />
		</>
	)
}
