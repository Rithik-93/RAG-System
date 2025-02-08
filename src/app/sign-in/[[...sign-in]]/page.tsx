import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="Logo"
            width={80}
            height={80}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              start your 14-day free trial
            </a>
          </p>
        </div>
        <div className="mt-8">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-indigo-600 hover:bg-indigo-700 text-white',
                socialButtonsBlockButton: 
                  'border border-gray-300 text-gray-700 hover:bg-gray-50',
                formFieldInput: 
                  'rounded-md border-gray-300 shadow-sm',
                card: 'rounded-xl shadow-none',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

