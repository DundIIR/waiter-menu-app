'use client'

import { FC, JSX, use, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import ProductForm from '../productForm'
import { ProductWithRelations } from '@/types/prisma'
import PizzaForm from '../pizzaForm'
import { useCartStore } from '@/store'
import toast from 'react-hot-toast'
import { Ingredient } from '@prisma/client'
import { Api } from '@/services/api-client'
import ProductGeneralForm from '../productGeneralForm'

interface IProps {
	product: ProductWithRelations
	className?: string
}

const ProductModal: FC<IProps> = ({ product, className }): JSX.Element => {
	const router = useRouter()

	return (
		<Dialog open={!!product} onOpenChange={() => router.back()}>
			<DialogContent
				className={cn('p-0 min-w-[1020px] min-h-[450px] bg-white overflow-hidden', className)}>
				<DialogTitle className="hidden" />
				<DialogDescription className="hidden" />
				<ProductGeneralForm product={product} onSubmit={() => router.back()} />
			</DialogContent>
		</Dialog>
	)
}

export default ProductModal
