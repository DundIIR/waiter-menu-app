'use client'

import { FC, JSX, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useClickAway, useDebounce } from 'react-use'
import Link from 'next/link'
import Image from 'next/image'
import { Api } from '@/services/api-client'
import { Product } from '@prisma/client'

interface IProps {
	className?: string
}

const SearchInput: FC<IProps> = ({ className }): JSX.Element => {
	const [searchQuery, setSearchQuery] = useState('')
	const [focused, setFocused] = useState(false)
	const [products, setProducts] = useState<Product[]>([])
	const ref = useRef<HTMLDivElement>(null)

	useClickAway(ref, () => {
		setFocused(false)
	})

	useDebounce(
		() => {
			Api.products.search(searchQuery, 10).then(data => setProducts(data))
		},
		300,
		[searchQuery],
	)

	const onClickProduct = () => {
		setSearchQuery('')
		setFocused(false)
		setProducts([])
	}

	return (
		<>
			{focused && <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-15"></div>}
			<div
				ref={ref}
				className={cn('flex rounded-2xl flex-1 justify-between relative h-11 z-15', className)}>
				<Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
				<input
					className="rounded-2xl outline-none w-full bg-gray-50 pl-11 font-medium"
					type="text"
					placeholder="Найти пиццу..."
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					onFocus={() => setFocused(true)}
				/>
			</div>

			{products.length > 0 && (
				<div
					className={cn(
						'absolute w-full bg-white rounded-xl py-3 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-15',
						focused && 'visible opacity-100 top-12',
					)}>
					{products.map(product => {
						return (
							<Link
								key={product.id}
								onClick={onClickProduct}
								href={`/product/${product.id}`}
								className="flex items-center gap-4 px-4 py-2 hover:bg-primary/10 transition ease-in-out duration-150">
								<img
									className="w-10 h-10 rounded-md object-cover"
									src={product.imageUrl}
									alt={product.name}
								/>
								<p className="font-semibold text-lg">{product.name}</p>
							</Link>
						)
					})}
				</div>
			)}
		</>
	)
}

export default SearchInput
