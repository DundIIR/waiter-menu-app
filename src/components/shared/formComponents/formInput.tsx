import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import RequiredSymbol from './requiredSymbol'
import { Input } from '@/components/ui/input'
import { ErrorText } from './errorText'
import { ClearButton } from './clearButton'
import { useFormContext } from 'react-hook-form'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string
	label?: string
	required?: boolean
	className?: string
}

export const FormInput: FC<IProps> = ({
	name,
	label,
	required,
	className,
	...props
}): JSX.Element => {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
		setError,
	} = useFormContext()

	const value = watch(name)
	const errorText = errors[name]?.message as string

	return (
		<div className={cn('', className)}>
			{label && (
				<label htmlFor={name} className="font-medium">
					{label} {required && <RequiredSymbol />}
				</label>
			)}
			<div className="relative">
				<Input
					className="h-12 text-md pr-10"
					id={name}
					required={required}
					{...register(name)}
					{...props}
				/>

				{value && (
					<ClearButton
						onClick={() => {
							setValue(name, '')
							setError(name, { message: '' })
						}}
					/>
				)}
			</div>

			{errorText && <ErrorText text={errorText} />}
		</div>
	)
}
