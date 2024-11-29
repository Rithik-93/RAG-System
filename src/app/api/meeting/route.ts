import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

const meetingSchema = z.object({
    meetingUrl: z.string(),
    meetingId: z.string(),
    projectId: z.string()
});

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { meetingUrl, meetingId, projectId } = meetingSchema.parse(body);

        const result = await processMeeting(meetingUrl);
        const summaries = result?.summaries;

        if (!summaries || !Array.isArray(summaries) || summaries.length === 0) {
            return NextResponse.json({ error: "No summaries returned from meeting" }, { status: 400 });
        }

        await db.issue.createMany({
            data: summaries.map(x => ({
                start: x.start,
                end: x.end,
                summary: x.summary,
                headline: x.headline,
                gist: x.gist,
                meetingId
            }))
        });

        await db.meeting.update({
            where: { id: meetingId },
            data: {
                status: 'COMPLETED',
                name: summaries[0]!.headline
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
