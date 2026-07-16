import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'
import { ingredients, categories, products } from './constants'

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
	await prisma.user.createMany({
		data: [
			{
				fullName: 'Пользователь',
				email: 'user@mail.com',
				password: 'password',
				verified: new Date(),
			},
			{
				fullName: 'Админ',
				email: 'admin@mail.com',
				password: hashSync('password', 10),
				verified: new Date(),
				role: 'ADMIN',
			},
		],
	})

	await prisma.category.createMany({
		data: categories,
	})

	await prisma.ingredient.createMany({
		data: ingredients,
	})

	await prisma.product.createMany({
		data: products,
	})

	const pizza1 = await prisma.product.create({
		data: {
			name: 'Пепперони Фреш',
			imageUrl:
				'https://media.dodostatic.net/image/r:292x292/0198bf57bc517218ab93c762f4b0193e.avif',
			categoryId: 1,
			ingredients: {
				connect: ingredients.slice(1, 6),
			},
		},
	})

	const pizza2 = await prisma.product.create({
		data: {
			name: 'Пикантные колбаски',
			imageUrl:
				'https://media.dodostatic.net/image/r:292x292/0198bf25089a74d08e08629b41ed39ee.avif',
			categoryId: 1,
			ingredients: {
				connect: ingredients.slice(5, 10),
			},
		},
	})

	const pizza3 = await prisma.product.create({
		data: {
			name: 'Чесночный цыпленок',
			imageUrl:
				'https://media.dodostatic.net/image/r:292x292/0198bf24170179679a7872f2ddf16d18.avif',
			categoryId: 1,
			ingredients: {
				connect: ingredients.slice(10, 40),
			},
		},
	})

	await prisma.productItem.createMany({
		data: [
			{ productId: pizza1.id, price: 189, size: 'SMALL', pizzaType: 'REGULAR' },
			{ productId: pizza1.id, price: 189, size: 'SMALL', pizzaType: 'THIN' },
			{ productId: pizza1.id, price: 239, size: 'MEDIUM', pizzaType: 'REGULAR' },
			{ productId: pizza1.id, price: 319, size: 'LARGE', pizzaType: 'REGULAR' },
			{ productId: pizza2.id, price: 189, size: 'SMALL', pizzaType: 'REGULAR' },
			{ productId: pizza2.id, price: 239, size: 'MEDIUM', pizzaType: 'REGULAR' },
			{ productId: pizza2.id, price: 319, size: 'LARGE', pizzaType: 'REGULAR' },
			{ productId: pizza3.id, price: 189, size: 'SMALL', pizzaType: 'REGULAR' },
			{ productId: pizza3.id, price: 239, size: 'MEDIUM', pizzaType: 'REGULAR' },
			{ productId: pizza3.id, price: 319, size: 'LARGE', pizzaType: 'REGULAR' },
			{ productId: 1, price: 250 },
			{ productId: 2, price: 250 },
			{ productId: 3, price: 250 },
			{ productId: 4, price: 250 },
			{ productId: 5, price: 250 },
			{ productId: 6, price: 250 },
			{ productId: 7, price: 250 },
			{ productId: 8, price: 250 },
			{ productId: 9, price: 250 },
			{ productId: 10, price: 250 },
			{ productId: 11, price: 250 },
			{ productId: 12, price: 250 },
			{ productId: 13, price: 250 },
			{ productId: 14, price: 250 },
			{ productId: 15, price: 250 },
			{ productId: 16, price: 250 },
			{ productId: 17, price: 250 },
		],
	})

	await prisma.cart.createMany({
		data: [
			{
				userId: 1,
				totalAmount: 0,
				token: '11111',
			},
			{
				userId: 2,
				totalAmount: 0,
				token: '222222',
			},
		],
	})

	await prisma.cartItem.create({
		data: {
			productItemId: 2,
			cartId: 1,
			quantity: 1,
		},
	})

	await prisma.cartItem.create({
		data: {
			productItemId: 1,
			cartId: 1,
			quantity: 2,
			ingredients: {
				connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
			},
		},
	})

	await prisma.story.createMany({
		data: [
			{
				previewImageUrl:
					'https://cdn.inappstory.ru/story/xep/xzh/zmc/cr4gcw0aselwvf628pbmj3j/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=3101815496',
			},
			{
				previewImageUrl:
					'https://cdn.inappstory.ru/story/km2/9gf/jrn/sb7ls1yj9fe5bwvuwgym73e/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=3074015640',
			},
			{
				previewImageUrl:
					'https://cdn.inappstory.ru/story/quw/acz/zf5/zu37vankpngyccqvgzbohj1/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=1336215020',
			},
			{
				previewImageUrl:
					'https://cdn.inappstory.ru/story/7oc/5nf/ipn/oznceu2ywv82tdlnpwriyrq/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=38903958',
			},
			{
				previewImageUrl:
					'https://cdn.inappstory.ru/story/q0t/flg/0ph/xt67uw7kgqe9bag7spwkkyw/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=2941222737',
			},
			{
				previewImageUrl:
					'https://cdn.inappstory.ru/story/lza/rsp/2gc/xrar8zdspl4saq4uajmso38/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=4207486284',
			},
		],
	})

	await prisma.storyItem.createMany({
		data: [
			{
				storyId: 1,
				sourceUrl:
					'https://cdn.inappstory.ru/file/dd/yj/sx/oqx9feuljibke3mknab7ilb35t.webp?k=IgAAAAAAAAAE',
			},
			{
				storyId: 1,
				sourceUrl:
					'https://cdn.inappstory.ru/file/jv/sb/fh/io7c5zarojdm7eus0trn7czdet.webp?k=IgAAAAAAAAAE',
			},
			{
				storyId: 1,
				sourceUrl:
					'https://cdn.inappstory.ru/file/ts/p9/vq/zktyxdxnjqbzufonxd8ffk44cb.webp?k=IgAAAAAAAAAE',
			},
			{
				storyId: 1,
				sourceUrl:
					'https://cdn.inappstory.ru/file/ur/uq/le/9ufzwtpdjeekidqq04alfnxvu2.webp?k=IgAAAAAAAAAE',
			},
			{
				storyId: 1,
				sourceUrl:
					'https://cdn.inappstory.ru/file/sy/vl/c7/uyqzmdojadcbw7o0a35ojxlcul.webp?k=IgAAAAAAAAAE',
			},
		],
	})

	console.log('Seeds created')
}

async function down() {
	await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "Story" RESTART IDENTITY CASCADE`
	await prisma.$executeRaw`TRUNCATE TABLE "StoryItem" RESTART IDENTITY CASCADE`
}

main().then(async () => {
	await prisma.$disconnect()
})
