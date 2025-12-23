'use server';

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";


export const signIn = async({ email, password }: signInProps) => {
    try {
        console.log('Attempting sign-in for:', email);
        const { account } = await createAdminClient();
        
        const session = await account.createEmailPasswordSession({
            email: email,
            password: password
        });
        
        console.log('Session created successfully:', session.userId);

        const cookieStore = await cookies();
        cookieStore.set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        
        console.log('Cookie set successfully');
        return parseStringify(session);
    } catch (error: any) {
        console.log('Sign-in error details:', error);
        console.log('Error code:', error.code);
        console.log('Error type:', error.type);
        
        if (error.code === 401) {
            throw new Error('Invalid email or password. Please check your credentials.');
        }
        
        throw new Error('Sign-in failed. Please try again.');
    }
}

export const signUp = async(userData: SignUpParams) => {
    const { email, password, firstName, lastName } = userData;

    try {
        const { account } = await createAdminClient();

        const newUserAccount = await account.create({
            userId: ID.unique(),
            email,
            password,
            name: `${firstName} ${lastName}`
        });

        const session = await account.createEmailPasswordSession({
            email,
            password
        });

        const cookieStore = await cookies();
        cookieStore.set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUserAccount);
    } catch (error: any) {
        console.log('Error:', error);
        
        // Handle specific Appwrite errors
        if (error.code === 409) {
            throw new Error('A user with this email already exists. Please use a different email or try signing in.');
        }
        
        throw new Error('Failed to create account. Please try again.');
    }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async() => {
    try {
        const { account } = await createSessionClient();
        
        // Delete the session on Appwrite
        await account.deleteSession('current');
        
        // Delete the cookie
        const cookieStore = await cookies();
        cookieStore.delete("appwrite-session");
        
        return { success: true };
    } catch (error) {
        console.log('Logout error:', error);
        return null;
    }
}