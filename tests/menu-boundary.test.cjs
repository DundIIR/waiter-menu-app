const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

function load(file, mocks = {}) {
	const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
		compilerOptions: { module: ts.ModuleKind.CommonJS },
	}).outputText
	const module = { exports: {} }
	vm.runInThisContext('(function(require, module, exports) {' + code + '\n})')(
		name => name in mocks ? mocks[name] : require(name), module, module.exports,
	)
	return module.exports
}

test('only GET requests for dishes pass the API boundary', () => {
	const NextResponse = { next: () => ({ status: 200 }), json: (_, options) => ({ status: options.status }) }
	const { middleware } = load('src/middleware.ts', { 'next/server': { NextResponse } })
	const request = (pathname, method = 'GET') => ({ nextUrl: { pathname }, method })
	assert.equal(middleware(request('/api/dishes')).status, 200)
	for (const [path, method] of [['/api/dishes', 'POST'], ['/api/users', 'GET'], ['/api/users', 'POST'], ['/api/auth/session', 'GET'], ['/api/cart', 'GET'], ['/api/checkout/callback', 'POST'], ['/api/products/search', 'GET'], ['/checkout', 'GET'], ['/profile', 'GET'], ['/not-auth', 'GET']]) {
		assert.equal(middleware(request(path, method)).status, 404, `${method} ${path}`)
	}
})

test('registration, profile updates and ordering are disabled', async () => {
	const actions = load('src/app/actions.ts')
	await assert.rejects(actions.registerUser({}), /отключена/)
	await assert.rejects(actions.updateUserInfo({}), /отключено/)
	await assert.rejects(actions.createOrder({}), /отключено/)
})

test('dish endpoint only returns published dishes', async () => {
	let query
	const prisma = { dish: { findMany: async args => { query = args; return [] } } }
	const NextResponse = { json: body => body }
	const api = load('src/app/api/dishes/route.ts', {
		'@/../prisma/prisma-client': { prisma }, 'next/server': { NextResponse },
	})
	await api.GET({ nextUrl: new URL('http://localhost/api/dishes?query=test') })
	assert.equal(query.where.isPublished, true)
	assert.equal(query.where.name.contains, 'test')
	assert.equal(query.take, 50)
})
