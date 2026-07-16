'use client'

import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { formRegisterSchema, TFormRegister } from './schemas'
import { FormInput } from '@/components/shared/formComponents'
import { Button } from '@/components/ui/button'
import { Title } from '@/components/ui/title'
import { registerUser } from '@/app/actions'

interface Props {
	onClose?: VoidFunction
	onClickLogin?: VoidFunction
}

export const RegisterForm: React.FC<Props> = ({ onClose, onClickLogin }) => {
	const form = useForm<TFormRegister>({
		resolver: zodResolver(formRegisterSchema),
		defaultValues: {
			email: '',
			fullName: '',
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit = async (data: TFormRegister) => {
		try {
			await registerUser({
				email: data.email,
				fullName: data.fullName,
				password: data.password,
			})

			toast.success('Регистрация успешна 📝. Подтвердите свою почту')

			onClose?.()
		} catch (error) {
			if (error instanceof Error) {
				return toast.error(`${error.message}`, {
					icon: '❌',
				})
			} else {
				return toast.error('Ошибка при регистрации', {
					icon: '❌',
				})
			}
		}
	}

	return (
		<FormProvider {...form}>
			<form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex justify-between items-center">
					<div className="mr-2">
						<Title text="Регистрация аккаунта" size="md" className="font-bold" />
						<p className="text-gray-400">Введите немного данных, чтобы мы знали кто вы</p>
					</div>
					<img src="/assets/images/phone-icon.png" alt="phone-icon" width={60} height={60} />
				</div>

				<FormInput name="email" label="E-Mail" required />
				<FormInput name="fullName" label="Полное имя" required />
				<FormInput name="password" label="Пароль" type="password" required />
				<FormInput name="confirmPassword" label="Подтвердите пароль" type="password" required />

				<Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
					Зарегистрироваться
				</Button>
			</form>
		</FormProvider>
	)
}
