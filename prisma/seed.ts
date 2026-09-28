import { PrismaClient } from '@prisma/client'
import { categories, ingredients, allergens, dishes } from './constants'

const prisma = new PrismaClient()

async function main() {
	try {
		await down()
		await up()
	} catch (e) {
		console.error(e)
	}
}

async function up() {
	await prisma.category.createMany({ data: categories })
	await prisma.ingredient.createMany({ data: ingredients })
	await prisma.allergen.createMany({ data: allergens })

	for (const dish of dishes) {
		const { ingredientIds, allergenIds, ...data } = dish

		await prisma.dish.create({
			data: {
				...data,
				isPublished: true,
				ingredients: { connect: ingredientIds.map(id => ({ id })) },
				allergens: { connect: allergenIds.map(id => ({ id })) },
			},
		})
	}

	console.log('Seeds created')
}

async function down() {
	await prisma.$executeRaw`TRUNCATE TABLE "Dish" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Allergen" RESTART IDENTITY CASCADE`
}

main().then(async () => {
	await prisma.$disconnect()
})
