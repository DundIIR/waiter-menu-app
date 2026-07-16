import HomeClient from '@/components/shared/homeClient'
import { findPizzas, GetSearchParams } from '@/lib/findPizzas'

export default async function Home({ searchParams }: { searchParams: GetSearchParams }) {
	const params = await searchParams
	const categories = await findPizzas(params)

	return <HomeClient categories={categories} />
}
