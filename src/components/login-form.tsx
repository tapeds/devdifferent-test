'use client'

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SubmitHandler } from "react-hook-form"
import { FormProvider, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

type LoginFieldProps = {
  email: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const methods = useForm<LoginFieldProps>()
  const { handleSubmit } = methods

  const mutation = useMutation({
    mutationFn: async (data: LoginFieldProps) => {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Something went wrong')
      }

      return response.json()
    },
    onSuccess: () => {
      setMessage({
        type: 'success',
        text: 'Check your email for the login link!',
      })
    },
    onError: (error: Error) => {
      setMessage({
        type: 'error',
        text: error.message,
      })
    },
  })

  const onSubmit: SubmitHandler<LoginFieldProps> = (data) => {
    setMessage(null)
    mutation.mutate(data)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      validation={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      }}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
                {message && (
                  <div
                    className={`p-3 rounded-md text-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
