import DishForm from '@/components/shared/admin/dishForm'

export const metadata = {
	title: 'Создать блюдо — Админка',
}

export default function NewDishPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Создать блюдо</h1>
			<DishForm />
		</div>
	)
}
