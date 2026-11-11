'use client'

import { useActionState, useRef } from 'react'
import { deleteMedia, updateMedia, uploadMedia } from '@/app/actions/admin'
import { Field } from '@/components/site/field'
import { Input } from '@/components/ui/input'
import type { Media } from '@/lib/types'
import { SubmitButton } from './form-bits'

function Feedback({ state }: { state: { error?: string; ok?: string } | null }) {
  if (!state) return null
  return (
    <p role={state.error ? 'alert' : 'status'} className={state.error ? 'text-sm text-destructive' : 'text-sm text-primary'}>
      {state.error ?? state.ok}
    </p>
  )
}

export function MediaUploadForm({ demo }: { demo: boolean }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action] = useActionState(async (prev: Parameters<typeof uploadMedia>[0], form: FormData) => {
    const result = await uploadMedia(prev, form)
    if (result?.ok) formRef.current?.reset()
    return result
  }, null)

  return (
    <form ref={formRef} action={action} className="grid gap-4 md:grid-cols-2">
      {demo ? (
        <Field id="url" label="Photo URL" hint="Preview mode: paste an https:// link or a /images/… path. Uploads work once Supabase is connected.">
          <Input id="url" name="url" required />
        </Field>
      ) : (
        <Field id="file" label="Image file" hint="JPG, PNG, WebP or AVIF, up to 8 MB.">
          <Input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required />
        </Field>
      )}
      <Field id="alt" label="Alt text *" hint="Describe what is in the photo for people using screen readers.">
        <Input id="alt" name="alt" required maxLength={300} />
      </Field>
      <Field id="caption" label="Caption (optional)" className="md:col-span-2">
        <Input id="caption" name="caption" maxLength={500} />
      </Field>
      <div className="flex flex-col gap-2 md:col-span-2">
        <Feedback state={state} />
        <div>
          <SubmitButton pendingLabel="Uploading…">Add photo</SubmitButton>
        </div>
      </div>
    </form>
  )
}

export function MediaCard({ media }: { media: Media }) {
  const [state, action] = useActionState(updateMedia.bind(null, media.id), null)
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[4/3] bg-muted">
        <img src={media.url} alt={media.alt} className="size-full object-cover" />
        {media.is_demo && (
          <span className="absolute left-2 top-2 rounded-md bg-foreground/80 px-2 py-0.5 text-xs text-background">Sample photo</span>
        )}
      </div>
      <form action={action} className="flex flex-1 flex-col gap-3 p-4">
        <Field id={`alt-${media.id}`} label="Alt text">
          <Input id={`alt-${media.id}`} name="alt" defaultValue={media.alt} required maxLength={300} />
        </Field>
        <Field id={`caption-${media.id}`} label="Caption">
          <Input id={`caption-${media.id}`} name="caption" defaultValue={media.caption ?? ''} maxLength={500} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_demo" defaultChecked={media.is_demo} className="size-4 accent-primary" />
          Label as sample photo on the site
        </label>
        <Feedback state={state} />
        <div className="mt-auto flex items-center justify-between gap-2">
          <SubmitButton variant="outline">Save</SubmitButton>
        </div>
      </form>
      <form action={deleteMedia.bind(null, media.id)} className="border-t border-border px-4 py-3">
        <SubmitButton
          variant="ghost"
          pendingLabel="Deleting…"
          confirmMessage="Delete this photo? It will be removed from any galleries and pages that use it."
        >
          Delete photo
        </SubmitButton>
      </form>
    </div>
  )
}
