import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {Link, useNavigate } from "react-router-dom"

import { useToast } from "@/components/ui/use-toast"

import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { signUpValidation } from "@/lib/validation"
import { Loader } from "@/components/shared/Loader"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


const SignupForm = () => {
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const {toast} = useToast();
  const navigate = useNavigate();
  const {mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccount()
  const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })



  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpValidation>) {
      const newUser = await createUserAccount(values);
      
      if(!newUser){
        return toast({
          title: "Sign Up Failed! Something went wrong :(",
        })
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      })

      if(!session){
        return toast({
          title: "Sign In Failed! Something went wrong :(",
        })
      }

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset();
        navigate("/")
      } else {
        return toast({
          title: "Sign In Failed! Something went wrong :(",
        })
      }



  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/logo.svg" alt="logo" width={200}
            height={40}/>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt12">Create a new account!</h2>
        <p className="text-light-3 small-medium md:base-regular">Please enter your details to create your account.</p>

        <div className="border-2 border-primary-500 rounded-lg p-10 w-full mt-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-col gap-5 w-full mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary w-full">
              {isCreatingUser ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading
                </div>
              ) : "Sign Up"

              }
            </Button>

            <p className="text-regular text-light-2 text-center mt-2">
              Already have an account? <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Sign in</Link>
            </p>

          </form>
        </div>
      </div>
    </Form>
  )
}

export default SignupForm