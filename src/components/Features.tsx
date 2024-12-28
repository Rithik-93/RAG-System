'use client'
import { Search, Database, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    name: 'Intelligent Search',
    description: 'Find exactly what you need with our advanced search capabilities powered by vector embeddings.',
    icon: Search,
  },
  {
    name: 'Comprehensive Indexing',
    description: 'Every file, commit message, and piece of documentation is indexed for complete coverage.',
    icon: Database,
  },
  {
    name: 'Lightning Fast',
    description: 'Get results in milliseconds, no matter the size of your repository.',
    icon: Zap,
  },
]

export default function Features() {
  return (
    <div className="py-12 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="font-poppins text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to search your code
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            RepoScan provides powerful tools to help you navigate and understand your codebase like never before.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

