import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary font-poppins">
              RepoScan
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link href="#features" className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-base font-medium text-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#" className="text-base font-medium text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center">
            <Button variant="outline" className="mr-4 border-primary text-primary hover:bg-primary hover:text-white">
              Log in
            </Button>
            <Button className="bg-primary text-white hover:bg-primary/90">Sign up</Button>
          </div>
        </div>
      </div>
    </header>
  )
}

