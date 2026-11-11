'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { nativeSelect } from '@/components/site/field'

export type MediaOption = { id: string; url: string; alt: string }

export function SubmitButton({
  children,
  pendingLabel = 'Saving…',
  variant,
  confirmMessage,
}: {
  children: React.ReactNode
  pendingLabel?: string
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost'
  confirmMessage?: string
}) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending}
      onClick={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) e.preventDefault()
      }}
    >
      {pending ? pendingLabel : children}
    </Button>
  )
}

export function MediaSelect({
  id,
  name,
  defaultValue,
  media,
  required,
}: {
  id: string
  name: string
  defaultValue: string
  media: MediaOption[]
  required?: boolean
}) {
  const [value, setValue] = useState(defaultValue)
  const selected = media.find((m) => m.id === value)
  return (
    <div className="flex items-start gap-3">
      <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        {selected && <img src={selected.url} alt="" className="size-full object-cover" />}
      </div>
      <select
        id={id}
        name={name}
        value={value}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        className={nativeSelect}
      >
        <option value="">{required ? 'Choose a photo…' : 'No photo'}</option>
        {media.map((m) => (
          <option key={m.id} value={m.id}>
            {m.alt.length > 70 ? `${m.alt.slice(0, 70)}…` : m.alt}
          </option>
        ))}
      </select>
    </div>
  )
}
