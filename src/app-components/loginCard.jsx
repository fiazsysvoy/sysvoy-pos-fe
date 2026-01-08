"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from "../components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
const apiUrl = process.env.NEXT_PUBLIC_API_URL
export const LoginCard = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange", // real-time validation as user types
  });
  const router = useRouter();
    const onSubmit = async (data) =>{
      console.log(apiUrl)
      try {
        console.log(data)
        const res = await axios.post(`${apiUrl}api/auth/signin`,
          {
          email:data.email,
          password:data.password
        })
        console.log(res)
        if(res.data.token){
          console.log(res)
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        router.push('/dashboard');
      }
      } catch (error) {
        toast.error("Invalid Login credentials")
        console.log(error)
      }
    }
    return (
        <div className="flex items-center justify-center w-full ">
    <Card className="w-1/4">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        {/* <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction> */}
      </CardHeader>
      <CardContent>
  <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6" style={{ gap: "1rem" }}>
        {/* Email */}
        <div className="flex flex-col gap-1" style={{ gap: "0.5rem" }}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1" style={{ gap: "0.5rem" }}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>
      </div>
        <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" variant="black" >
        Login
        </Button>
      </CardFooter>
    </form>
      </CardContent>
    </Card>
        </div>

    )
}
