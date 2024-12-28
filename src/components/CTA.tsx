'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

function CTA() {
  return (
    <div className="bg-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8"
      >
        <h2 className="font-poppins text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block">Start using RepoScan today.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          Unlock the full potential of your codebase with our powerful search and analysis tools.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="secondary" size="lg" className="mt-8 w-full sm:w-auto">
            Get started for free
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CTA;