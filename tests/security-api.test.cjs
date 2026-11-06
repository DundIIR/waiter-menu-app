const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

function load(file, mocks) {
	const source = fs.readFileSync(file, 'utf8')
	const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
	const module = { exports: {} }
	vm.runInThisContext('(function(require, module, exports) {' + code + '\n})')(
		name => name in mocks ? mocks[name] : require(name), module, module.exports,
	)
	return module.exports
}

const NextResponse = { json: (body, options = {}) => ({ body, status: options.status ?? 200 }) }

test('users API rejects anonymous and non-admin requests before listing or creating users', async () => {
	let session = null
	let databaseCalls = 0
	const prisma = { user: {
		findUnique: async () => ({ role: 'USER' }),
		findMany: async () => { databaseCalls++; return [] },
		create: async () => { databaseCalls++ },
	} }
	const api = load('src/app/api/users/route.ts', {
		'next/server': { NextResponse }, '@/../prisma/prisma-client': { prisma },
		'@/lib/getServerSession': { GetServerSession: async () => session },
	})
	assert.equal((await api.GET()).status, 401)
	assert.equal((await api.POST({ json: async () => ({}) })).status, 401)
	session = { id: '2', role: 'ADMIN' }
	assert.equal((await api.GET()).status, 403)
	assert.equal((await api.POST({ json: async () => ({}) })).status, 403)
	assert.equal(databaseCalls, 0)
})

test('users API validates input, hashes passwords and only selects safe fields', async () => {
	let createArgs
	const prisma = { user: {
		findUnique: async () => ({ role: 'ADMIN' }),
		findMany: async args => { assert.equal(args.select.password, undefined); return [] },
		create: async args => { createArgs = args; return { id: 1, email: args.data.email } },
	} }
	const api = load('src/app/api/users/route.ts', {
		'next/server': { NextResponse }, '@/../prisma/prisma-client': { prisma },
		'@/lib/getServerSession': { GetServerSession: async () => ({ id: '1' }) },
		bcrypt: { hash: async value => 'hashed:' + value },
	})
	assert.equal((await api.GET()).status, 200)
	const input = { fullName: 'User', email: 'user@example.com', password: 'password123' }
	assert.equal((await api.POST({ json: async () => ({ ...input, role: 'ADMIN' }) })).status, 400)
	const result = await api.POST({ json: async () => input })
	assert.equal(result.status, 201)
	assert.equal(createArgs.data.password, 'hashed:password123')
	assert.equal(createArgs.data.role, undefined)
	assert.equal(createArgs.select.password, undefined)
	assert.equal(result.body.password, undefined)
})

test('cart serialization does not expose token or user id', () => {
	const { publicCart } = load('src/lib/publicCart.ts', {})
	assert.deepEqual(publicCart({ id: 1, token: 'secret', userId: 5, items: [] }), { id: 1, items: [] })
})

test('cart item mutations require the current cart token', async () => {
	const operations = []
	const prisma = { cartItem: {
		updateMany: async args => { operations.push(args); return { count: 0 } },
		deleteMany: async args => { operations.push(args); return { count: 0 } },
	} }
	const api = load('src/app/api/cart/[id]/route.ts', {
		'next/server': { NextResponse }, '../../../../../prisma/prisma-client': { prisma },
		'@/lib/updateCartTotalAmount': {}, '@/lib/publicCart': {},
	})
	const req = { cookies: { get: () => ({ value: 'own-token' }) }, json: async () => ({ quantity: 1 }) }
	const ctx = { params: Promise.resolve({ id: '42' }) }
	assert.equal((await api.PATCH(req, ctx)).status, 404)
	assert.equal((await api.DELETE(req, ctx)).status, 404)
	for (const operation of operations) assert.equal(operation.where.cart.token, 'own-token')
})

test('payment callback checks the provider and uses the verified recipient', async () => {
	const oldStore = process.env.YOOKASSA_STORE_ID
	const oldKey = process.env.YOOKASSA_API_KEY
	process.env.YOOKASSA_STORE_ID = 'test-store'
	process.env.YOOKASSA_API_KEY = 'test-key'
	let recipient
	let changed = 0
	const prisma = { order: {
		findFirst: async args => {
			assert.equal(args.where.paymentId, 'payment-1')
			return { id: 7, items: '[]' }
		},
		updateMany: async () => { changed++; return { count: 1 } },
	} }
	const api = load('src/app/api/checkout/callback/route.ts', {
		'next/server': { NextResponse },
		'../../../../../prisma/prisma-client': { prisma },
		'@prisma/client': { OrderStatus: { PENDING: 'PENDING', CONFIRMED: 'CONFIRMED', CANCELLED: 'CANCELLED' } },
		'@/components/shared/emailSendMessage/sendEmail': { sendEmail: async email => { recipient = email } },
		'@/components/shared/emailSendMessage/orderSuccessTemplate': { OrderSuccessTemplate: () => '' },
		axios: { default: { get: async () => ({ data: { id: 'payment-1', status: 'succeeded', paid: true, metadata: { order_id: '7', email: 'verified@example.com' } } }) } },
	})
	try {
		const result = await api.POST({ json: async () => ({ type: 'notification', event: 'payment.succeeded', object: { id: 'payment-1', metadata: { email: 'attacker@example.com' } } }) })
		assert.equal(result.status, 200)
		assert.equal(changed, 1)
		assert.equal(recipient, 'verified@example.com')
	} finally {
		if (oldStore === undefined) delete process.env.YOOKASSA_STORE_ID
		else process.env.YOOKASSA_STORE_ID = oldStore
		if (oldKey === undefined) delete process.env.YOOKASSA_API_KEY
		else process.env.YOOKASSA_API_KEY = oldKey
	}
})

test('payment callback rejects an event that does not match the provider status', async () => {
	const oldStore = process.env.YOOKASSA_STORE_ID
	const oldKey = process.env.YOOKASSA_API_KEY
	process.env.YOOKASSA_STORE_ID = 'test-store'
	process.env.YOOKASSA_API_KEY = 'test-key'
	let queriedOrder = false
	const api = load('src/app/api/checkout/callback/route.ts', {
		'next/server': { NextResponse },
		'../../../../../prisma/prisma-client': { prisma: { order: { findFirst: async () => { queriedOrder = true } } } },
		'@prisma/client': { OrderStatus: {} },
		'@/components/shared/emailSendMessage/sendEmail': {},
		'@/components/shared/emailSendMessage/orderSuccessTemplate': {},
		axios: { default: { get: async () => ({ data: { id: 'payment-1', status: 'canceled' } }) } },
	})
	try {
		const result = await api.POST({ json: async () => ({ type: 'notification', event: 'payment.succeeded', object: { id: 'payment-1' } }) })
		assert.equal(result.status, 400)
		assert.equal(queriedOrder, false)
	} finally {
		if (oldStore === undefined) delete process.env.YOOKASSA_STORE_ID
		else process.env.YOOKASSA_STORE_ID = oldStore
		if (oldKey === undefined) delete process.env.YOOKASSA_API_KEY
		else process.env.YOOKASSA_API_KEY = oldKey
	}
})
