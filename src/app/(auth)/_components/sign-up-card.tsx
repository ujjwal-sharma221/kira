import Image from "next/image";
import { Eye, EyeClosed, Github } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { TextDivider } from "@/components/text-divider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema, registerValues } from "@/lib/schemas/auth-schema";

export function SignUpCard() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<registerValues>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(values: registerValues) {
    console.log(values);
  }
  return (
    <Card className="h-full w-full border-none shadow-none md:w-[487px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="capitalize">Register</CardTitle>
        <CardDescription className="text-start">
          Thanks for giving a chance to kira, by signing up you agree to our{" "}
          <span className="font-medium text-black hover:underline">terms</span>{" "}
          and{" "}
          <span className="font-medium text-black hover:underline">
            policies
          </span>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your account username" {...field} />
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
                    <Input placeholder="your account email" {...field} />
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
                    <div className="flex justify-between gap-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="your account password"
                        className=""
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="size-5 text-neutral-600" />
                        ) : (
                          <EyeClosed className="size-5 text-neutral-600" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size="lg" className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <TextDivider text="Other login methods" />
      </div>
      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button className="w-full" variant="outline" size="lg">
          <Image
            src="/google.svg"
            height={25}
            width={25}
            alt="google"
            className="mt-0.5"
          />
          Login with google
        </Button>
        <Button className="w-full" variant="outline" size="lg">
          <Github />
          Login with github
        </Button>
      </CardContent>
    </Card>
  );
}
