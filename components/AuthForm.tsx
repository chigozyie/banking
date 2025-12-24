"use client";
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { fi } from 'zod/v4/locales';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            address1: "",
            city: "",
            state: "",
            postalCode: "",
            dateOfBirth: "",
            ssn: "",
            email: "",
            password: ""
        },
    })
    
    const onSubmit = async(data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            // Sign up with Appwrite & create plaid token
           
            if(type === 'sign-up') {
                 const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password
                }

                const newUser = await signUp(userData);

                setUser(newUser);
                toast.success("Account created successfully!");
            }
            if(type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password
                });
                
                if (response) {
                    toast.success("Signed in successfully!");
                    router.push('/');
                }
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            toast.error(error.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    
  return (
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
            <Link href='/'
                    className='flex cursor-pointer items-center gap-1'>
                    <Image 
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Horizon Logo"
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Horizon</h1>
                </Link>
                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                        {user? 'Link Account': type === 'sign-in' ? 'Sign In' : "Sign Up"}
                    </h1>
                    <p className='text-16 font-normal text-gray-600'>
                        {user ? 'Link your account to get started'
                        : 'Please enter your details'}
                    </p>
                </div>
        </header>
        {user ? (
            <div className='flex flex-col gap-4'>
                <PlaidLink user={user} variant="primary" />
            </div>
         ): ( 
            <>
            <Card className="w-full sm:max-w-md">
            <CardHeader>
                {/* <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                Update your profile information below.
                </CardDescription> */}
            </CardHeader>
            <CardContent>
                <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
                    {type === 'sign-up' && (
                        <>
                        <div className='flex gap-4'>
                            <CustomInput control={form.control} name={"firstName"} label={"First Name"} placeholder={"Enter your first name"} />
                            <CustomInput control={form.control} name={"lastName"} label={"Last Name"} placeholder={"Enter your last name"} />
                        </div>
                        <CustomInput control={form.control} name={"address1"} label={"Address"} placeholder={"Enter your specific address"} />
                        <CustomInput control={form.control} name={"city"} label={"City"} placeholder={"Enter your city"} />
                        <div className='flex gap-4'>
                            <CustomInput control={form.control} name={"state"} label={"State"} placeholder={"Example: NY"} />
                            <CustomInput control={form.control} name={"postalCode"} label={"Postal Code"} placeholder={"Example: 11101"} />
                        </div>
                        <div className='flex gap-4'>
                            <CustomInput control={form.control} name={"dateOfBirth"} label={"Date of Birth"} placeholder={"YYYY-MM-DD"} />
                            <CustomInput control={form.control} name={"ssn"} label={"SSN"} placeholder={"Example: 1234"} />
                        </div>
                        </>
                    )}
                <CustomInput control={form.control} name={"email"} label={"Email"} placeholder={"Enter your email"} />
                <CustomInput control={form.control} name={"password"} label={"Password"} placeholder={"Enter your password"} />
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                <div className='flex flex-row gap-4'>
                    <Button disabled={isLoading} type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button className='form-btn' type="submit" form="form-rhf-input"> {isLoading ? (
                        <>
                        <Loader2 size={20} 
                        className='animate-spin'/> &nbsp;
                        Loading...
                        </>
                    ) : type === 'sign-in'
                    ? 'Sign In' : 'Sign up' }
                    </Button>
                </div>
                </Field>
            </CardFooter>
            </Card>
            <footer className='flex justify-center gap-1'>
                <p className='text-14 font-normal text-gray-600'>
                    {type === 'sign-in' ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Link className='form-link' href={type==='sign-in'? '/sign-up' : "/sign-in"}>
                    {type==='sign-in'? 'Sign-up' : "Sign-in"}
                </Link>
            </footer>
            </>
        )} 
    </section>
  )
}

export default AuthForm