'use client'

import { useActionState } from 'react'
import { savePageContent } from '@/app/actions/admin'
import { Field } from '@/components/site/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ContentField } from '@/lib/content-defs'
import { MediaSelect, SubmitButton, type MediaOption } from './form-bits'

export function PageContentForm({
  page,
  fields,
  values,
  media,
}: {
  page: string
  fields: ContentField[]
  values: Record<string, string>
  media: MediaOption[]
}) {
  const [state, action] = useActionState(savePageContent.bind(null, page), null)
  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
        {fields.map((f) => {
          const id = `c-${f.key}`
          return (
            <Field key={f.key} id={id} label={f.label} hint={f.help}>
              {f.type === 'image' ? (
                <MediaSelect id={id} name={f.key} defaultValue={values[f.key]} media={media} />
              ) : f.type === 'textarea' ? (
                <Textarea id={id} name={f.key} defaultValue={values[f.key]} rows={4} />
              ) : (
                <Input id={id} name={f.key} defaultValue={values[f.key]} />
              )}
            </Field>
          )
        })}
      </div>
      {state && (
        <p role={state.error ? 'alert' : 'status'} className={state.error ? 'text-sm text-destructive' : 'text-sm text-primary'}>
          {state.error ?? state.ok}
        </p>
      )}
      <div>
        <SubmitButton>Save page</SubmitButton>
      </div>
    </form>
  )
}
