import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/backend/lib/mongodb";
import User from "@/backend/Schema/userSchema";
import bcrypt from "bcrypt";

const authOptions = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectToDatabase();
                
                const user = await User.findOne({ email: credentials.email });
                if (!user) throw new Error("User not found");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid password");

                return {
                    id: user._id,
                    email: user.email,
                    role: user.role, // ← Added new
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phonenumber: user.phonenumber,
                    address: user.address,
                    city: user.city,
                    district: user.district,
                    zipcode: user.zipcode
                };
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    secret: process.env.NEXTAUTH_SECRET, 
    session: { strategy: "jwt" }, 
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role; // ← Added new
                token.firstname = user.firstname;
                token.lastname = user.lastname;
                token.phonenumber = user.phonenumber;
                token.address = user.address;
                token.city = user.city;
                token.district = user.district;
                token.zipcode = user.zipcode;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role; // added new
            session.user.firstname = token.firstname;
            session.user.lastname = token.lastname;
            session.user.phonenumber = token.phonenumber;
            session.user.address = token.address;
            session.user.city = token.city;
            session.user.district = token.district;
            session.user.zipcode = token.zipcode;
            return session;
        }
    },
    pages:{
        signIn: "/auth/admin"
    }
});

export { authOptions as GET, authOptions as POST };
