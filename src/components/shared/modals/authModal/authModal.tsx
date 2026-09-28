import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import LoginForm from './forms/loginForm'

interface IProps {
	open: boolean
	onClose: () => void
	className?: string
}

const AuthModal: FC<IProps> = ({ open, onClose, className }): JSX.Element => {
	const handleClose = () => {
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className={cn('w-[450px] bg-white p-10', className)}>
				<LoginForm onClose={handleClose} />
			</DialogContent>
		</Dialog>
	)
}

export default AuthModal
