import NextAuth, { AuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { email } from 'zod'
import { prisma } from '../../../../../prisma/prisma-client'
import { compare, hashSync } from 'bcrypt'
import { Session } from 'inspector/promises'
import { UserRole } from '@prisma/client'
import { signIn } from 'next-auth/react'

export const authOptions: AuthOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID || '',
			clientSecret: process.env.GITHUB_SECRET || '',
			profile(profile) {
				return {
					id: String(profile.id),
					name: profile.name || profile.login,
					email: profile.email,
					image: profile.avatar_url,
					role: 'USER' as UserRole,
				}
			},
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				if (!credentials) {
					return null
				}

				const values = {
					email: credentials.email,
				}

				const findUser = await prisma.user.findFirst({ where: values })
				console.log()
				if (!findUser) {
					return null
				}

				const isPasswordCorrect = await compare(credentials.password, findUser.password)

				if (!isPasswordCorrect) {
					return null
				}

				if (!findUser.verified) {
					return null
				}

				const user = {
					id: String(findUser.id),
					name: findUser.fullName,
					email: findUser.email,
					role: findUser.role,
				}

				return user
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async signIn({ user, account }) {
			try {
				if (account?.provider === 'credentials') {
					return true
				}

				if (!user.email) {
					return false
				}

				const findUser = await prisma.user.findFirst({
					where: {
						OR: [
							{ provider: account?.provider, providerId: account?.providerAccountId },
							{ email: user.email },
						],
					},
				})

				if (findUser) {
					await prisma.user.update({
						where: {
							id: findUser.id,
						},
						data: {
							provider: account?.provider,
							providerId: account?.providerAccountId,
						},
					})
					return true
				}

				await prisma.user.create({
					data: {
						email: user.email,
						fullName: user?.name || 'User #' + user.id,
						password: hashSync(user?.id.toString() + process.env.NEXTAUTH_SECRET, 10),
						verified: new Date(),
						provider: account?.provider,
						providerId: account?.providerAccountId,
					},
				})

				return true
			} catch (error) {
				return false
			}
		},

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
