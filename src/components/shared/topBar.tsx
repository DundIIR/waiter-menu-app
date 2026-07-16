'use client'

import { FC, JSX, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import Categories from './categories'
import SortPopup from './sortPopup'
import { Container } from './container'

interface IProps {
	className?: string
}

const TopBar: FC<IProps> = ({ className }): JSX.Element => {
	const [isSticky, setIsSticky] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsSticky(window.scrollY > 180)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<div
			className={cn(
				'sticky top-0 py-5 z-10 backdrop-blur-md bg-white/70',
				isSticky && 'shadow-lg shadow-black/5',
				className,
			)}>
			<Container className="flex-row ">
				<Categories />
				<SortPopup />
			</Container>
		</div>
	)
}

export default TopBar
