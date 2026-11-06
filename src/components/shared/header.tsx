'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/shared/container'
import { cn } from '@/lib/utils'
import SearchInput from './searchInput'

interface IProps {
	hasSearch?: boolean
	hasCart?: boolean
	className?: string
}

export default function Header({ hasSearch = true, className }: IProps) {
	return (
		<header className={cn('border-b bg-white', className)}>
			<Container className="flex-row gap-6 py-8">
				<Link href="/" className="flex items-center gap-2">
					<Image src="/logo.ico" alt="" width={44} height={44} />
					<span className="text-2xl font-black">Waiter — меню</span>
				</Link>
				{hasSearch && <div className="flex-1 relative"><SearchInput /></div>}
			</Container>
		</header>
	)
}
