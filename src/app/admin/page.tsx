import Link from 'next/link'
import { GetServerSession } from '@/lib/getServerSession'

export default async function AdminPage() {
	const user = await GetServerSession()

	return (
		<div>
			<p>Здравствуйте, {user?.name ?? user?.email}.</p>
			<p className="text-gray-400 mt-2">
				Здесь появятся разделы: категории, ингредиенты, аллергены, блюда.
			</p>

			<Link href="/admin/dishes/new" className="inline-block mt-5 text-primary underline">
				+ Создать блюдо
			</Link>
		</div>
	)
}
