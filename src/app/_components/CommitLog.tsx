"use client"

import { useProject } from "@/hooks/use-project"
import { api } from "@/trpc/react"
import { GitCommit, AlertCircle, Loader2 } from "lucide-react"

const CommitLog = () => {
  const { projectId } = useProject()
  const { data: commits, isLoading, error } = api.project.getCommits.useQuery({ projectId })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-lg">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-600">Loading commits...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-red-50 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-medium text-red-700">Error loading commits</p>
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      </div>
    )
  }

  if (!commits || commits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-lg">
        <GitCommit className="w-12 h-12 text-gray-400" />
        <p className="mt-4 text-lg font-medium text-gray-600">No commits found</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Commit History</h2>
        <div className="overflow-y-auto h-[600px] pr-4">
          {commits.map((commit) => (
            <div key={commit.id} className="mb-6 last:mb-0 pb-6 last:pb-0 border-b last:border-b-0 border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={commit.commitAuthorAvatar || "/placeholder.svg"}
                    alt={commit.commitAuthorName}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(commit.commitAuthorName)}&background=random`
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{commit.commitMessage}</h3>
                    <time
                      className="text-sm text-gray-500 whitespace-nowrap"
                      dateTime={new Date(commit.commitDate).toISOString()}
                    >
                      {new Date(commit.commitDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{commit.commitAuthorName} committed</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                    <GitCommit className="h-4 w-4" />
                    <span>{commit.commitHash.slice(0, 7)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommitLog

