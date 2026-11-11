'use client'

import { useActionState } from 'react'
import { signIn } from '@/app/actions/admin'
import { Field } from '@/components/site/field'
import { Input } from '@/components/ui/input'
import { SubmitButton } from './form-bits'

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action] = useActionState(signIn, initialError ? { error: initialError } : null)
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field id="email" label="Email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field id="password" label="Password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
    </form>
  )
}
