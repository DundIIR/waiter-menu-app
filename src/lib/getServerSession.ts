import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

export interface ISessionUser {
	id?: string | null
	name?: string | null
	role?: string | null
	email?: string | null
}

export const GetServerSession = async (): Promise<ISessionUser | null> => {
	const session = await getServerSession(authOptions)

	return session?.user ?? null
}
