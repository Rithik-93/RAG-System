'use client'
import Issues from './Issues'
import React from 'react'

type Props = {
    params: Promise<{ meetingId: string }>
}

const MeetingDetailsPage = async ({ params }: Props) => {
    const { meetingId } = await params
    return (
        <Issues meetingId={meetingId} />
    )
}

export default MeetingDetailsPage
