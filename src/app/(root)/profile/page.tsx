import { ProfileForm } from '@/components/shared/formComponents/profile/profileForm'
import { Button } from '@/components/ui/button'
import { GetServerSession } from '@/lib/getServerSession'
import { redirect } from 'next/navigation'
import { prisma } from '../../../../prisma/prisma-client'

export default async function ProfilePage() {
	const session = await GetServerSession()

	if (!session) {
		return redirect('/not-auth')
	}

	const user = await prisma.user.findFirst({ where: { id: Number(session?.id) } })

	if (!user) {
		return redirect('/not-auth')
	}

	return <ProfileForm data={user} />
}
