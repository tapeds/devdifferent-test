'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleMagicLink = async () => {
      const { error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error during magic link sign-in:', error.message)
      } else {
        router.push('/')
      }
    }

    handleMagicLink()
  }, [router])

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Logging you in...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
