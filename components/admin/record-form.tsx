'use client'

import { useActionState } from 'react'
import { saveRecord } from '@/app/actions/admin'
import { Field, nativeSelect } from '@/components/site/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { COLLECTION_MAP, type AdminField } from '@/lib/admin/collections'
import { cn } from '@/lib/utils'
import { MediaSelect, SubmitButton, type MediaOption } from './form-bits'

type Option = { value: string; label: string }

function toText(field: AdminField, value: unknown) {
  if (value === null || value === undefined) return ''
  if (Array.isArray(value)) return value.join('\n')
  return String(value)
}

export function RecordForm({
  collectionKey,
  recordId,
  values,
  media,
  relationOptions,
}: {
  collectionKey: string
  recordId: string | null
  values: Record<string, unknown>
  media: MediaOption[]
  relationOptions: Record<string, Option[]>
}) {
  const collection = COLLECTION_MAP[collectionKey]
  const [state, action] = useActionState(saveRecord.bind(null, collectionKey, recordId), null)

  const control = (field: AdminField) => {
    const id = `f-${field.key}`
    const value = toText(field, values[field.key])
    const describedBy = field.help ? `${id}-help` : undefined
    switch (field.type) {
      case 'textarea':
        return <Textarea id={id} name={field.key} defaultValue={value} rows={field.key === 'description' ? 8 : 3} required={field.required} />
      case 'list':
        return <Textarea id={id} name={field.key} defaultValue={value} rows={5} />
      case 'bool':
        return (
          <label htmlFor={id} className="flex items-center gap-2 text-sm">
            <input id={id} name={field.key} type="checkbox" defaultChecked={values[field.key] === true} className="size-4 accent-primary" />
            {field.label}
          </label>
        )
      case 'select':
        return (
          <select id={id} name={field.key} defaultValue={value} required={field.required} className={nativeSelect}>
            {!field.required && <option value="">—</option>}
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )
      case 'relation':
        return (
          <select id={id} name={field.key} defaultValue={value} required={field.required} className={nativeSelect}>
            <option value="">Choose…</option>
            {relationOptions[field.key]?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )
      case 'media':
        return <MediaSelect id={id} name={field.key} defaultValue={value} media={media} required={field.required} />
      case 'int':
      case 'money':
        return (
          <Input
            id={id}
            name={field.key}
            type="number"
            inputMode="decimal"
            step={field.type === 'money' ? '0.01' : '1'}
            min={field.min ?? 0}
            max={field.max}
            defaultValue={value}
            required={field.required}
            aria-describedby={describedBy}
          />
        )
      case 'date':
        return <Input id={id} name={field.key} type="date" defaultValue={value} required={field.required} />
      default:
        return (
          <Input
            id={id}
            name={field.key}
            defaultValue={value}
            required={field.required}
            pattern={field.type === 'slug' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined}
            maxLength={field.type === 'slug' ? 80 : 300}
          />
        )
    }
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-5 rounded-xl border border-border bg-card p-5 md:grid-cols-2">
        {collection.fields.map((field) =>
          field.type === 'bool' ? (
            <div key={field.key} className="flex flex-col gap-1 md:col-span-2">
              {control(field)}
              {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
            </div>
          ) : (
            <Field
              key={field.key}
              id={`f-${field.key}`}
              label={field.required ? `${field.label} *` : field.label}
              hint={field.help}
              className={cn((field.wide || field.type === 'media') && 'md:col-span-2')}
            >
              {control(field)}
            </Field>
          ),
        )}
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <SubmitButton>{recordId ? 'Save changes' : `Create ${collection.singular}`}</SubmitButton>
        <p className="text-xs text-muted-foreground">* Required</p>
      </div>
    </form>
  )
}
