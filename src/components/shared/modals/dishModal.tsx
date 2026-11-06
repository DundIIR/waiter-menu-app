'use client'

import { FC, JSX } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useDishModalStore } from '@/store/dishModal'
import DishView from '../dishView'

const DishModal: FC = (): JSX.Element => {
	const { dish, isOpen, closeDish } = useDishModalStore()

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && closeDish()}>
			<DialogContent className="p-0 min-w-[1020px] min-h-[450px] bg-white overflow-hidden">
				<DialogTitle className="hidden">{dish?.name}</DialogTitle>
				<DialogDescription className="hidden" />
				{dish && <DishView dish={dish} />}
			</DialogContent>
		</Dialog>
	)
}

export default DishModal
