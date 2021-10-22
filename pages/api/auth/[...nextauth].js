import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

import { prisma } from '/prisma/client';
export default NextAuth({
    cookie: {
        secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
    },
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: "credentials",
            async authorize(credentials) {
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email,
                        password: credentials.password
                    }
                }) || await prisma.user.findFirst({
                    where: {
                        name: credentials.email,
                        password: credentials.password
                    }
                })
                if ( user !== null){
                    return user;
                }
                else {
                    return null;
                }
            },
            callbacks: {
                async signIn({ user, account, profile, email, credentials }) {
                    if (typeof user.userId !== typeof undefined){
                        if (user.role === 'ADMIN'){
                            return user;
                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        return false;
                    }
                },
                async session({ session, user, token }) {
                    if (user !== null){
                        session.user = user;
                    }
                    else if (typeof token.user !== typeof undefined && (typeof session.user === typeof undefined 
                        || (typeof session.user !== typeof undefined && typeof session.user.id === typeof undefined))){
                        session.user = token.user;
                    }
                    else if (typeof token !== typeof undefined){
                        session.token = token;
                    }
                    return session;
                },
                async jwt({ token, user, account, profile, isNewUser }) {
                    if (typeof user !== typeof undefined){
                        token.user = user;
                    }
                    return token;
                }
            }
        }),

    ],
    
})