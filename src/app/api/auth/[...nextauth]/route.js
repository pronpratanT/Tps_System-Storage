import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb"; // Adjust the import path as necessary
import User from "../../../../../models/user"; // Adjust the import path as necessary
import bcrypt from 'bcryptjs';

const authOptions = {
  providers: [
      CredentialsProvider({
        name: 'credentials',
        credentials: {

        },
        async authorize(credentials, req) {
          const {email, password} = credentials;
          try{
              await connectMongoDB();
              const user = await User.findOne({email});

              if(!user){
                  return null;
              }
              const passwordMatch = await bcrypt.compare(password, user.password);

              if(!passwordMatch){
                  return null;
              }
              return user;

          }catch(error){
              console.log("Error", error);
          }

        }
      })
    ],
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login"
    },
}

const handler = NextAuth(authOptions);
export{handler as GET, handler as POST};
