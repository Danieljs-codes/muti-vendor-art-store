import { signUp$ } from "@/server/auth"
import { signUpSchema } from "@/utils/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { useForm } from "react-hook-form"
import { useSpinDelay } from "spin-delay"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Link,
  Loader,
  Note,
  TextField,
} from "ui"
import type { z } from "zod"

export const Route = createFileRoute("/_auth-layout-id/sign-up")({
  component: RouteComponent,
})

function RouteComponent() {
  const signUp = useServerFn(signUp$)
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (data: z.infer<typeof signUpSchema>) => {
      const res = await signUp({
        data,
      })
      if (!res.success) {
        throw new Error(res.message)
      }

      return res
    },
    onError: (error) => {
      form.setError("root", {
        message: error.message,
      })
    },
  })

  const isLoading = useSpinDelay(isPending, {
    minDuration: 500,
  })

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    mutate(values)
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-fg mt-2">
          Sign up to start renting cars, list your vehicles for rent, and manage
          your rental bookings.
        </p>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {form.formState.errors.root && (
              <Note intent="danger">{form.formState.errors.root.message}</Note>
            )}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <TextField
                        {...field}
                        label="Full Name"
                        isInvalid={!!error}
                        errorMessage={error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <TextField
                        {...field}
                        label="Email"
                        isInvalid={!!error}
                        errorMessage={error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <TextField
                        {...field}
                        label="Password"
                        type="password"
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        isRevealable
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <TextField
                        {...field}
                        label="Confirm Password"
                        type="password"
                        isInvalid={!!error}
                        errorMessage={error?.message}
                        isRevealable
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              size="small"
              className="w-full mt-6"
              isPending={isPending}
            >
              {isLoading ? <Loader variant="spin" /> : "Sign up"}
            </Button>
          </form>
        </Form>
      </div>
      <p className="text-sm text-muted-fg mt-6 text-center">
        Already have an account?{" "}
        <Link intent="primary" href="/sign-in" className="font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
