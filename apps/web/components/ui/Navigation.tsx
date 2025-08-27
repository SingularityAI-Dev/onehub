import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// This is a placeholder component for the main application navigation bar.

const Navigation = ({ className }: { className?: string }) => {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <nav className="container h-14 flex items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* Placeholder for Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="font-bold">OneHub</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Placeholder for User Profile / Actions */}
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="font-semibold text-muted-foreground">A</span>
          </div>
        </div>
      </nav>
    </header>
  )
}

Navigation.displayName = "Navigation"

export { Navigation }
