'use client'

import { Container } from '@/components/shared/container'
import { Title } from '@/components/ui/title'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	CheckoutAddress,
	CheckoutCart,
	CheckoutPersonal,
	CheckoutSidebar,
} from '@/components/shared/checkout'
import UseCart from '@/hooks/use-cart'
import {
	checkoutFormSchema,
	TCheckoutForm,
} from '@/components/shared/checkout/schemas/checkoutFormSchema'
import { createOrder } from '@/app/actions'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function CheckoutPage() {
	const { totalAmount, items, firstLoading, removeCartItem, handleClickCountButton } = UseCart()
	const [loadingSubmit, setLoadingSubmit] = useState(false)

	const form = useForm<TCheckoutForm>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			phone: '',
			address: '',
			comment: '',
		},
		mode: 'onSubmit',
	})

	const onSubmit = async (data: TCheckoutForm) => {
		try {
			setLoadingSubmit(true)
			const url = await createOrder(data)
			toast.success('Заказ успешно оформлен! Переход на оплату...')

			if (url) {
				location.href = url
			}
		} catch (error) {
			console.error('[CHECKOUT_ERROR]', error)
			setLoadingSubmit(false)
			toast.error('Не удалось создать заказ')
		}
	}

	return (
		<Container className="mt-10">
			<Title text="Оформление заказа" className="font-extrabold mb-8 text-[36px]" />

			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex gap-10">
						{/* Левая часть */}
						<div className="flex flex-col flex-1 gap-10 mb-20">
							<CheckoutCart
								items={items}
								loading={firstLoading}
								removeCartItem={removeCartItem}
								handleClickCountButton={handleClickCountButton}
							/>
							<CheckoutPersonal className={firstLoading ? 'opacity-50 pointer-events-none' : ''} />
							<CheckoutAddress className={firstLoading ? 'opacity-50 pointer-events-none' : ''} />
						</div>
						{/* Правая часть */}
						<div className="flex flex-col w-[450px]">
							<CheckoutSidebar
								loadingSubmit={loadingSubmit}
								totalAmount={totalAmount}
								loading={firstLoading}
							/>
						</div>
					</div>
				</form>
			</FormProvider>
		</Container>
	)
}
