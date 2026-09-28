import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../../../../../prisma/prisma-client'
import { compare } from 'bcrypt'

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials) {
					return null
				}

				const findUser = await prisma.user.findFirst({
					where: { email: credentials.email },
				})

				if (!findUser) {
					return null
				}

				const isPasswordCorrect = await compare(credentials.password, findUser.password)

				if (!isPasswordCorrect) {
					return null
				}

				return {
					id: String(findUser.id),
					name: findUser.fullName,
					email: findUser.email,
					role: findUser.role,
				}
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token }: { token: any }) {
			const findUser = await prisma.user.findFirst({ where: { email: token.email } })

			if (findUser) {
				token.id = String(findUser.id)
				token.name = findUser.fullName
				token.email = findUser.email
				token.role = findUser.role
			}
			return token
		},
		async session({ session, token }: { session: any; token: any }) {
			if (session.user) {
				session.user.id = String(token.id)
				session.user.role = token.role
				session.user.name = token.name
				return session
			}
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
