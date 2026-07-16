import { FC, JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import LoginForm from './forms/loginForm'
import { RegisterForm } from './forms/registerForm'

interface IProps {
	open: boolean
	onClose: () => void
	className?: string
}

const AuthModal: FC<IProps> = ({ open, onClose, className }): JSX.Element => {
	const [type, setType] = useState<'login' | 'register'>('login')

	const onSwitchType = () => {
		setType(prev => (prev === 'login' ? 'register' : 'login'))
	}

	const handleClose = () => {
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className={cn('w-[450px] bg-white p-10', className)}>
				{type === 'login' ? (
					<LoginForm onClose={handleClose} />
				) : (
					<RegisterForm onClose={handleClose} />
				)}

				<hr />
				<div className="flex gap-2">
					<Button
						variant="secondary"
						onClick={() =>
							signIn('github', {
								callbackUrl: '/',
								redirect: true,
							})
						}
						type="button"
						className="gap-2 h-12 p-2 flex-1">
						<img className="w-6 h-6" src="https://github.githubassets.com/favicons/favicon.svg" />
						GitHub
					</Button>
					<Button
						variant="secondary"
						onClick={() =>
							signIn('google', {
								callbackUrl: '/',
								redirect: true,
							})
						}
						type="button"
						className="gap-2 h-12 p-2 flex-1">
						<img
							className="w-6 h-6"
							src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
						/>
						Google
					</Button>
				</div>

				<Button variant={'outline'} className="h-12" onClick={onSwitchType}>
					{type === 'login' ? 'Зарегистрироваться' : 'Войти'}
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default AuthModal
