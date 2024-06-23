import { Tag } from "lucide-react"
import { z } from "zod"

export const signUpValidation = z.object({
    name: z.string().min(2, {message: "Name must contain at least 2 character(s)"}).max(50, {message: "Name must contain at most 50 character(s)"}),
    username: z.string().min(5, {message: "Username must contain at least 5 character(s)"}).max(50, {message: "Username must contain at most 50 character(s)"}),
    email: z.string().email(),
    password: z.string().min(8,  {message: "Password must contain at least 8 character(s)"})
  })
export const signInValidation = z.object({
    email: z.string().email(),
    password: z.string()
  })

export const postValidation = z.object({
    caption: z.string().max(2200, {message: "Your caption can be up to 2200 characters long. Feel free to get creative within this space!"}),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string().max(2200, {message: "Your tags can be up to 2200 characters long. Feel free to get creative within this space!"})
  })

  export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
  });