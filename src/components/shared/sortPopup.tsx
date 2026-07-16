import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpDown } from 'lucide-react'

interface IProps {
	className?: string
}

const SortPopup: FC<IProps> = ({ className }): JSX.Element => {
	return (
		<div className={cn('inline-flex gap-1 items-center bg-gray-50 px-5 rounded-2xl h-[52px] cursor-pointer ', className)}>
			<ArrowUpDown size={16} />
			<b>Сортировка:</b>
			<b className="text-primary">популярное</b>
		</div>
	)
}

export default SortPopup
