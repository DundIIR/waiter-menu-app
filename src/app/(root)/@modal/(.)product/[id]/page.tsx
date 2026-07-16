import ProductModal from '@/components/shared/modals/productModal'
import { prisma } from '../../../../../../prisma/prisma-client'
import { notFound } from 'next/navigation'

const ProductPage = async (props: { params: Promise<{ id: string }> }) => {
	const { id } = await props.params

	const product = await prisma.product.findFirst({
		where: { id: Number(id) },
		include: {
			ingredients: true,
			variations: true,
		},
	})

	if (!product) {
		return notFound()
	}

	return <ProductModal product={product} />
}

export default ProductPage
