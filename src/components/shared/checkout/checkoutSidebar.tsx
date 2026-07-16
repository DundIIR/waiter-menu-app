import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { CheckoutItemDetails, WhiteBlock } from '.'
import { ArrowRight, Package, Percent, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const VAT = 14
const DELIVERY_PRICE = 250

interface IProps {
	totalAmount: number
	loading?: boolean
	loadingSubmit?: boolean
	className?: string
}

export const CheckoutSidebar: FC<IProps> = ({
	totalAmount,
	loading,
	loadingSubmit,
	className,
}): JSX.Element => {
	const vatPrice = (totalAmount * VAT) / 100
	const totalPrice = totalAmount + DELIVERY_PRICE + vatPrice

	return (
		<WhiteBlock className={cn('p-6 sticky top-4', className)}>
			<div className="flex flex-col gap-1">
				<span className="text-xl">Итого:</span>
				{loading ? (
					<Skeleton className="h-11 w-40" />
				) : (
					<span className="h-11 text-[34px] font-extrabold">{totalPrice} ₽</span>
				)}
			</div>

			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Package size={18} className="mr-2 text-gray-400" />
						Стоимость корзины:
					</div>
				}
				value={totalAmount}
				loading={loading}
			/>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Percent size={18} className="mr-2 text-gray-400" />
						Налоги:
					</div>
				}
				value={`${vatPrice} ₽`}
				loading={loading}
			/>
			<CheckoutItemDetails
				title={
					<div className="flex items-center">
						<Truck size={18} className="mr-2 text-gray-400" />
						Доставка:
					</div>
				}
				value={`${DELIVERY_PRICE} ₽`}
				loading={loading}
			/>

			<Button
				loading={loadingSubmit}
				type="submit"
				className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
				Перейти к оплате
				<ArrowRight className="w-5 ml-2" />
			</Button>
		</WhiteBlock>
	)
}
