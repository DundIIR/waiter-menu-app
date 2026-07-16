'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Textarea } from '../../ui/textarea'
import { ClearButton } from './clearButton'

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string
	name: string
	label?: string
	required?: boolean
}

export const FormTextarea: React.FC<Props> = ({ className, name, label, required, ...props }) => {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
		setError,
	} = useFormContext()

	const value = watch(name)
	const errorText = errors[name]?.message as string

	const onClickClear = () => {
		setValue(name, '')
		setError(name, { message: '' })
	}

	return (
		<div className={className}>
			<p className="font-medium mb-2">
				{label} {required && <span className="text-red-500">*</span>}
			</p>

			<div className="relative">
				<Textarea
					className="h-12 text-md pr-10 max-w-[750px] scrollbar"
					{...register(name)}
					{...props}
				/>

				{value && <ClearButton onClick={onClickClear} />}
			</div>

			{errorText && <p className="text-red-500 text-sm mt-2">{errorText}</p>}
		</div>
	)
}
