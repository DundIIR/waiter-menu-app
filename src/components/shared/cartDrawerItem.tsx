import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'

import * as CartItem from '@/components/shared/cartItemDetails'
import { CartItemProps } from './cartItemDetails/cart-item-details.types'
import { Trash2Icon } from 'lucide-react'
import Link from 'next/link'

interface IProps extends CartItemProps {
	onClickCountButton?: (type: 'plus' | 'minus') => void
	onClickRemoveButton?: () => void
	className?: string
}

const CartDrawerItem: FC<IProps> = ({
	imageUrl,
	name,
	price,
	quantity,
	details,
	disabled,
	onClickCountButton,
	onClickRemoveButton,
	className,
}): JSX.Element => {
	return (
		<Link
			href={'#'}
			prefetch
			className={cn(
				'flex bg-[#ffffff98] p-5 gap-6',
				{ 'opacity-50 pointer-events-none': disabled },
				className,
			)}>
			<CartItem.Image src={imageUrl} />
			<div className="flex-1">
				<CartItem.Info name={name} details={details} />

				<hr className="my-3" />

				<div className="flex items-center justify-between">
					<CartItem.CountButton onClick={onClickCountButton} value={quantity} />

					<div className="flex items-center gap-3">
						<CartItem.Price value={price} />
						<Trash2Icon
							onClick={onClickRemoveButton}
							className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-150"
							size={16}
						/>
					</div>
				</div>
			</div>
		</Link>
	)
}

export default CartDrawerItem
