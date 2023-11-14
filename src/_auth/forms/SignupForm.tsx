import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import {Button} from '@/components/ui/button'
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {SignupValidation} from '@/lib/validation'
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations.ts"
import {useUserContext} from '@/context/AuthContext'


const SignupForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading} = useUserContext()
  const navigate = useNavigate()
  

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  const {mutateAsync: createUserAccount, isPending: isCreatingAccount} = useCreateUserAccount()
  const {mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();


  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again.", });
        
        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account", });
        
        navigate("/sign-in");
        
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again.", });
        
        return;
      }
    } catch (error) {
      console.log({ error });
    }
  }
  
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-col flex-center">
        <img src="/assets/images/logo.svg" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-12">
          To use Titay, please enter your account details
        </p>

        <form onSubmit={form.handleSubmit(handleSignup)} 
            className="flex flex-col gap-5 w-full mt-4">
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
          
          <Button 
            type="submit" 
            className="shad-button_primary"
          >
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 mt-2 text-center">
              Aleardy have an account?
              <Link to='/sign-in' className="text-primary-500 ml-1 text-small-semibold">
                Log in
              </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm