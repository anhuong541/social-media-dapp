'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import { Menu, MessageCircle, Radio, User } from 'lucide-react'

import { truncateAddress } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { NAV_ITEMS } from '@/constants/navigation'
import { ThemeToggle } from './theme-toggle'

const iconMap = {
  radio: Radio,
  'message-circle': MessageCircle,
  user: User,
} as const

export default function Header() {
  const router = useRouter()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <header className="h-[10vh] w-full">
      <div className="mx-auto flex h-full items-center justify-between border-b px-3">
        <div className="text-2xl font-medium">
          Social Media <br className="sm:hidden" />{' '}
          <sup className="hidden text-xs sm:inline">( Graduation thesis )</sup>
        </div>

        <div className="flex items-center justify-end gap-1 md:gap-5">
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
          {address && (
            <Link
              href={`/profile/${address}`}
              className="px-3 py-1 text-center text-sm text-primary hover:underline md:text-base"
            >
              <p>{truncateAddress(address)}</p>
            </Link>
          )}

          <div className="flex items-center justify-center lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="pt-12">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  {!address ? (
                    <ConnectButton chainStatus="icon" showBalance={false} />
                  ) : (
                    <Button variant="destructive" onClick={() => disconnect()}>
                      Disconnect
                    </Button>
                  )}
                </SheetHeader>
                <Separator className="my-4" />
                <nav className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon]
                    if (item.href === 'profile') {
                      return (
                        <Button
                          key={item.label}
                          variant="ghost"
                          className="justify-start gap-3"
                          disabled={!address}
                          onClick={() =>
                            address && router.push(`/profile/${address}`)
                          }
                        >
                          <Icon className="size-5 text-primary" />
                          {item.label}
                        </Button>
                      )
                    }

                    return (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="justify-start gap-3"
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className="size-5 text-primary" />
                          {item.label}
                        </Link>
                      </Button>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden items-center justify-end gap-4 lg:flex">
            <ThemeToggle />
            {!address ? (
              <ConnectButton chainStatus="icon" showBalance={false} />
            ) : (
              <Button variant="destructive" onClick={() => disconnect()}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
