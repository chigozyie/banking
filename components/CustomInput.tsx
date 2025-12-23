import { Input } from './ui/input'
import React from 'react'
import { Controller, FieldPath } from 'react-hook-form'
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from './ui/field'
import { Control } from 'react-hook-form'
import  { z } from 'zod'
import { authFormSchema } from '@/lib/utils'

const formSchema = authFormSchema('sign-up');

interface CustomInput {
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label:string,
    placeholder: string
}

const CustomInput = ({ control, name, label, placeholder }: CustomInput) => {
  return (
    <FieldGroup>
        <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-input-label">
                {label}
            </FieldLabel>
            <Input
                {...field}
                id= {`form-rhf-input-${name}`}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                autoComplete={name}
                className='input-class'
                type={name === 'password' ? 'password' : 'text'}
            />
            <FieldDescription>  </FieldDescription>
            {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
            )}
            </Field>
            
        )}
        />
    </FieldGroup>
  )
}

export default CustomInput