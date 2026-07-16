import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { WhiteBlock } from '.'
import { FormInput } from '../formComponents'

interface IProps {
	className?: string
}

export const CheckoutPersonal: FC<IProps> = ({ className }): JSX.Element => {
	return (
		<WhiteBlock title="2. Персональная информация" className={cn('', className)}>
			<div className="grid grid-cols-2 gap-5">
				<FormInput name="firstName" className="text-base" placeholder="Имя" />
				<FormInput name="lastName" className="text-base" placeholder="Фамилия" />
				<FormInput name="email" className="text-base" placeholder="E-Mail" />
				<FormInput name="phone" className="text-base" placeholder="Телефон" />
			</div>
		</WhiteBlock>
	)
}
