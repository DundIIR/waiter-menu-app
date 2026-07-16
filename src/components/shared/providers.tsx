'use client'

import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import NextTopLoader from 'nextjs-toploader'

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<SessionProvider>{children}</SessionProvider>
			<NextTopLoader />
			<Toaster />
		</>
	)
}
