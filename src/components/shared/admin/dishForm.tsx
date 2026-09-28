'use client'

import { FC, JSX, useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Category, Ingredient, Allergen } from '@prisma/client'
import { Api } from '@/services/api-client'
import { FormInput, FormTextarea } from '@/components/shared/formComponents'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import MultiSelect, { MultiSelectOption } from '@/components/ui/filter/multiSelect'

const dishFormSchema = z.object({
	name: z.string().min(2, { message: 'Введите название блюда' }),
	description: z.string().optional(),
	imageUrl: z.string().url({ message: 'Введите корректную ссылку на фото' }),
	price: z.coerce.number().positive({ message: 'Введите цену больше нуля' }),
	weight: z.coerce.number().positive({ message: 'Введите вес больше нуля' }),
	categoryId: z.coerce.number().positive({ message: 'Выберите категорию' }),
	isPublished: z.boolean().optional(),
})

type TDishFormInput = z.input<typeof dishFormSchema>
type TDishFormOutput = z.output<typeof dishFormSchema>

const toggled = (source: Set<string>, id: string): Set<string> => {
	const next = new Set(source)
	if (next.has(id)) next.delete(id)
	else next.add(id)
	return next
}

const DishForm: FC = (): JSX.Element => {
	const [categories, setCategories] = useState<Category[]>([])
	const [ingredients, setIngredients] = useState<Ingredient[]>([])
	const [allergens, setAllergens] = useState<Allergen[]>([])
	const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set())
	const [selectedAllergens, setSelectedAllergens] = useState<Set<string>>(new Set())

	const [newIngredientName, setNewIngredientName] = useState('')
	const [newIngredientImageUrl, setNewIngredientImageUrl] = useState('')
	const [creatingIngredient, setCreatingIngredient] = useState(false)

	const form = useForm<TDishFormInput, unknown, TDishFormOutput>({
		resolver: zodResolver(dishFormSchema),
		defaultValues: {
			name: '',
			description: '',
			imageUrl: '',
			price: undefined,
			weight: undefined,
			categoryId: undefined,
			isPublished: false,
		},
	})

	useEffect(() => {
		Api.categories.getAll().then(setCategories).catch(console.error)
		Api.ingredients.getAll().then(setIngredients).catch(console.error)
		Api.allergens.getAll().then(setAllergens).catch(console.error)
	}, [])

	const ingredientOptions: MultiSelectOption[] = ingredients.map(ingredient => ({
		text: ingredient.name,
		value: String(ingredient.id),
	}))

	const allergenOptions: MultiSelectOption[] = allergens.map(allergen => ({
		text: allergen.name,
		value: String(allergen.id),
	}))

	const onCreateIngredient = async () => {
		if (!newIngredientName.trim() || !newIngredientImageUrl.trim()) {
			toast.error('Укажите название и ссылку на фото ингредиента')
			return
		}

		setCreatingIngredient(true)
		try {
			const ingredient = await Api.ingredients.create(newIngredientName.trim(), newIngredientImageUrl.trim())
			setIngredients(prev => [...prev, ingredient])
			setSelectedIngredients(prev => toggled(prev, String(ingredient.id)))
			setNewIngredientName('')
			setNewIngredientImageUrl('')
			toast.success('Ингредиент создан')
		} catch (error) {
			console.error('[CREATE_INGREDIENT] ', error)
			toast.error('Не удалось создать ингредиент')
		} finally {
			setCreatingIngredient(false)
		}
	}

	const onSubmit = async (data: TDishFormOutput) => {
		try {
			await Api.dishes.create({
				name: data.name,
				description: data.description || undefined,
				imageUrl: data.imageUrl,
				price: Math.round(data.price * 100),
				weight: data.weight,
				categoryId: data.categoryId,
				isPublished: data.isPublished,
				ingredientIds: Array.from(selectedIngredients).map(Number),
				allergenIds: Array.from(selectedAllergens).map(Number),
			})

			toast.success('Блюдо создано')
			form.reset()
			setSelectedIngredients(new Set())
			setSelectedAllergens(new Set())
		} catch (error) {
			console.error('[CREATE_DISH] ', error)
			toast.error('Не удалось создать блюдо')
		}
	}

	return (
		<FormProvider {...form}>
			<form className="flex flex-col gap-5 max-w-[600px]" onSubmit={form.handleSubmit(onSubmit)}>
				<FormInput name="name" label="Название" required />
				<FormTextarea name="description" label="Описание" />
				<FormInput name="imageUrl" label="Ссылка на фото" required />

				<div className="flex gap-5">
					<FormInput name="price" label="Цена, ₽" type="number" step="0.01" required className="flex-1" />
					<FormInput name="weight" label="Вес, г" type="number" required className="flex-1" />
				</div>

				<div>
					<p className="font-medium mb-2">
						Категория <span className="text-red-500">*</span>
					</p>
					<Controller
						control={form.control}
						name="categoryId"
						render={({ field }) => (
							<Select
								value={field.value ? String(field.value) : undefined}
								onValueChange={value => field.onChange(Number(value))}>
								<SelectTrigger className="w-full h-12">
									<SelectValue placeholder="Выберите категорию" />
								</SelectTrigger>
								<SelectContent>
									{categories.map(category => (
										<SelectItem key={category.id} value={String(category.id)}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					{form.formState.errors.categoryId && (
						<p className="text-red-500 text-sm mt-2">{form.formState.errors.categoryId.message}</p>
					)}
				</div>

				<div>
					<p className="font-medium mb-2">Ингредиенты</p>
					<MultiSelect
						nameGroup="ingredients"
						options={ingredientOptions}
						values={selectedIngredients}
						onToggle={value => setSelectedIngredients(prev => toggled(prev, value))}
					/>

					<div className="flex gap-2 mt-3">
						<Input
							placeholder="Название нового ингредиента"
							value={newIngredientName}
							onChange={event => setNewIngredientName(event.target.value)}
						/>
						<Input
							placeholder="Ссылка на фото"
							value={newIngredientImageUrl}
							onChange={event => setNewIngredientImageUrl(event.target.value)}
						/>
						<Button type="button" variant="outline" loading={creatingIngredient} onClick={onCreateIngredient}>
							+ Создать
						</Button>
					</div>
				</div>

				<div>
					<p className="font-medium mb-2">Аллергены</p>
					<MultiSelect
						nameGroup="allergens"
						options={allergenOptions}
						values={selectedAllergens}
						onToggle={value => setSelectedAllergens(prev => toggled(prev, value))}
					/>
				</div>

				<Controller
					control={form.control}
					name="isPublished"
					render={({ field }) => (
						<label className="flex items-center gap-2 cursor-pointer">
							<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							Опубликовано (видно в меню)
						</label>
					)}
				/>

				<Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
					Создать блюдо
				</Button>
			</form>
		</FormProvider>
	)
}

export default DishForm
