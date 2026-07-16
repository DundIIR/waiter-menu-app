import { notFound } from 'next/navigation'
import { prisma } from '../../../../../prisma/prisma-client'
import { Container } from '@/components/shared/container'
import ProductGeneralForm from '@/components/shared/productGeneralForm'

const ProductPage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params

	const product = await prisma.product.findFirst({
		where: { id: Number(id) },
		include: {
			ingredients: true,
			// TODO вынести в отдельный запрос, и через UE отображать
			category: {
				include: {
					products: {
						include: {
							variations: true,
						},
					},
				},
			},
			variations: true,
		},
	})

	if (!product) {
		return notFound()
	}

	return (
		<Container className="flex flex-col ">
			<ProductGeneralForm product={product} />
		</Container>
	)
}

export default ProductPage
