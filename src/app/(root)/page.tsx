import HomeClient from '@/components/shared/homeClient'
import { findDishes } from '@/lib/findDishes'

// Меню тянем из базы на каждый запрос: страница больше не зависит от searchParams,
// и без этого Next пререндерил бы её один раз на сборке и отдавал устаревшее меню.
export const dynamic = 'force-dynamic'

export default async function Home() {
	// Грузим всё меню целиком — фильтрация происходит на клиенте, без похода на сервер
	const categories = await findDishes()

	return <HomeClient categories={categories} />
}
