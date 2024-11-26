import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation';
import prisma from '../../../prisma/src';

const SyncUser = async() => {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('User not found');
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId)
    
    if(!user.emailAddresses[0]?.emailAddress) {
      return notFound()
    }

    await prisma.user.upsert({
      where: {
        emailAddress: user.emailAddresses[0]?.emailAddress ?? ""
      },
      update:{
        imageUrl: user.imageUrl,
        firstName: user.firstName,
        lastName: user.lastName
      },
      create: {
        emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
        id: userId,
        imageUrl: user.imageUrl,
        firstName: user.firstName,
        lastName: user.lastName
      }
    })

  return redirect('/dashboard')
}

export default SyncUser
