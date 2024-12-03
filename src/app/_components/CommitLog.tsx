'use client'

import { useProject } from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitCommit } from 'lucide-react'

const CommitLog = () => {
  const { projectId } = useProject()
  const { data: commits, isLoading, error } = api.project.getCommits.useQuery({ projectId })

  if (isLoading) return <div>Loading commits...</div>
  if (error) return <div>Error loading commits: {error.message}</div>
  if (!commits || commits.length === 0) return <div>No commits found.</div>

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Commit History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {commits.map((commit) => (
            <div key={commit.id} className="mb-6 last:mb-0">
              <div className="flex items-start space-x-4">
                <Avatar className="mt-1">
                  <AvatarImage src={commit.commitAuthorAvatar} alt={commit.commitAuthorName} />
                  <AvatarFallback>{commit.commitAuthorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{commit.commitMessage}</h3>
                    <time className="text-sm text-muted-foreground" dateTime={commit.commitDate.toISOString()}>
                      {new Date(commit.commitDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {commit.commitAuthorName} committed
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <GitCommit className="h-4 w-4" />
                    <span>{commit.commitHash.slice(0, 7)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default CommitLog

