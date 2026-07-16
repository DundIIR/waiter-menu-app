'use client'

import { FC, JSX } from 'react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Button } from '../ui/button'
import { CircleUser, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface IProps {
	onClickSigIn?: () => void
	className?: string
}

const ProfileButton: FC<IProps> = ({ onClickSigIn, className }): JSX.Element => {
	const { data: session, status } = useSession()
	const router = useRouter()

	if (status === 'loading') {
		return <div className="w-30"></div>
	}

	return (
		<div className={cn('', className)}>
			{!session ? (
				<Button onClick={onClickSigIn} variant="outline" className="flex items-center gap-2">
					<User height={16} width={22} />
					Войти
				</Button>
			) : (
				<Button
					onClick={() => router.push('/profile')}
					variant="secondary"
					className="flex items-center gap-2">
					<CircleUser height={16} width={22} />
					Профиль
				</Button>
			)}
		</div>
	)
}

export default ProfileButton
