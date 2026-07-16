'use client'
import { FC, JSX } from 'react'
import { AddressSuggestions } from 'react-dadata'
import 'react-dadata/dist/react-dadata.css'

interface IProps {
	onChange?: (value?: string) => void
}

export const AddressInput: FC<IProps> = ({ onChange }): JSX.Element => {
	return (
		<AddressSuggestions
			token={process.env.NEXT_PUBLIC_DADATA_TOKEN!}
			onChange={data => onChange?.(data?.value)}
		/>
	)
}
