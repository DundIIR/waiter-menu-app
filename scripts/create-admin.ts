import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
	const email = process.env.ADMIN_EMAIL
	const password = process.env.ADMIN_PASSWORD

	if (!email || !password) {
		throw new Error('ADMIN_EMAIL и ADMIN_PASSWORD должны быть заданы в .env')
	}

	const admin = await prisma.user.upsert({
		where: { email },
		update: {
			password: hashSync(password, 10),
			role: 'ADMIN',
		},
		create: {
			fullName: 'Админ',
			email,
			password: hashSync(password, 10),
			role: 'ADMIN',
		},
	})

	console.log(`Админ готов: ${admin.email} (id=${admin.id})`)
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
