import Link from 'next/link';
import { NavItem } from './nav-item';
import Providers from './providers';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  CircleUserRound,
  List,
  Calendar
} from 'lucide-react'
import { 
  Separator 
} from "@/components/ui/separator"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:pl-14">
          {/* <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <DashboardBreadcrumb />
            <SearchInput />
            <User />
          </header> */}
          <main className="grid flex-1 items-start gap-2 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-gradient-to-l from-zinc-900 ... sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem href="/" label="Home">
            <CircleUserRound />
        </NavItem>
        <Separator></Separator>
        <NavItem href="/tasks" label="Tasks">
            <List className="h-5 w-5"/>
        </NavItem>
        <NavItem href="/today" label="Today">
            <Calendar className="h-5 w-5"/>
        </NavItem>
      </nav>
    </aside>
  );
}