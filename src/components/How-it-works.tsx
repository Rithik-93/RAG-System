'use client'
import { GitBranch, Database, Search } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    name: 'Upload Your Repo',
    description: 'Connect your GitHub repository or upload your codebase directly to RepoScan.',
    icon: GitBranch,
  },
  {
    name: 'Indexing and Processing',
    description: 'Our system scrapes and analyzes your entire repository, storing it in a vector database for efficient retrieval.',
    icon: Database,
  },
  {
    name: 'Search and Discover',
    description: 'Use our powerful search interface to find exactly what you need across your entire codebase.',
    icon: Search,
  },
]

export default function HowItWorks() {
  return (
    <div className="py-12 bg-gray-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="font-poppins text-base text-primary font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Three simple steps to unlock your codebase
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Get started with RepoScan in no time and start exploring your repository like never before.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <step.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {index + 1}. {step.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{step.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

