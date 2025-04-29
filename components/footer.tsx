import { Github, Linkedin, Globe } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t py-6 px-4 mt-8">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Huegan. Created by{" "}
            <Link
              href="https://ashxinkumar.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Ashwin Kumar Uma Sankar
            </Link>
            . All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://ashxinkumar.me"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 hover:bg-muted"
            aria-label="Portfolio"
          >
            <Globe className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/ashwinkumar99/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 hover:bg-muted"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link
            href="https://github.com/itaxh1"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 hover:bg-muted"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
