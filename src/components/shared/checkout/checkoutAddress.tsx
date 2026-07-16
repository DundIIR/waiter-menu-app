import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { WhiteBlock } from '.'
import { AddressInput, FormInput, FormTextarea } from '../formComponents'
import { Controller, useFormContext } from 'react-hook-form'
import { ErrorText } from '../formComponents/errorText'

interface IProps {
	className?: string
}

export const CheckoutAddress: FC<IProps> = ({ className }): JSX.Element => {
	const { control } = useFormContext()

	return (
		<WhiteBlock title="3. Адрес доставки" className={cn('', className)}>
			<div className="flex flex-col gap-5">
				<Controller
					name="address"
					render={({ field, fieldState }) => (
						<>
							<AddressInput onChange={field.onChange} />
							{fieldState.error && (
								<ErrorText className="text-red-500" text={fieldState.error.message} />
							)}
						</>
					)}
				/>

				<FormTextarea name="comment" className="text-base" placeholder="Комментарий к заказу" />
			</div>
		</WhiteBlock>
	)
}
