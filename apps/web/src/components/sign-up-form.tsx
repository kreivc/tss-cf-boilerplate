import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Gamepad2Icon,
  LockIcon,
  MailIcon,
  RocketIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { m } from "@/paraglide/messages";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm() {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/",
            });
            toast.success(m.signUpSuccess());
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, m.nameMinLength()),
        email: z.email(m.invalidEmail()),
        password: z.string().min(8, m.passwordMinLength()),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden p-4">
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="breathing absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-gaming-secondary/20 blur-3xl" />
        <div
          className="breathing absolute bottom-1/3 -left-20 h-96 w-96 rounded-full bg-gaming-primary/20 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gaming-accent/10 blur-3xl" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gaming-secondary via-gaming-primary to-gaming-secondary opacity-30 blur-lg" />

        <div className="glass-strong relative rounded-2xl border border-glass-border p-8">
          {/* Logo/Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gaming-secondary/30 blur-lg" />
                <div className="relative rounded-xl bg-gradient-to-br from-gaming-secondary to-gaming-primary p-4">
                  <Gamepad2Icon className="size-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="mb-2 font-bold text-2xl">{m.createAccount()}</h1>
            <p className="text-muted-foreground text-sm">
              Join the ultimate gaming top-up platform
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {/* Name Field */}
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor={field.name}>
                    {m.name()}
                  </Label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="size-4 text-muted-foreground transition-colors group-focus-within:text-gaming-primary" />
                    </div>
                    <Input
                      className="h-12 border-glass-border bg-background/50 pl-10 transition-all focus:border-gaming-primary focus:ring-gaming-primary/20"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Your gamer name"
                      value={field.state.value}
                    />
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p
                      className="text-destructive text-sm"
                      key={error?.message}
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            {/* Email Field */}
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor={field.name}>
                    {m.email()}
                  </Label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MailIcon className="size-4 text-muted-foreground transition-colors group-focus-within:text-gaming-primary" />
                    </div>
                    <Input
                      className="h-12 border-glass-border bg-background/50 pl-10 transition-all focus:border-gaming-primary focus:ring-gaming-primary/20"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="gamer@example.com"
                      type="email"
                      value={field.state.value}
                    />
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p
                      className="text-destructive text-sm"
                      key={error?.message}
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            {/* Password Field */}
            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label className="font-medium text-sm" htmlFor={field.name}>
                    {m.password()}
                  </Label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockIcon className="size-4 text-muted-foreground transition-colors group-focus-within:text-gaming-primary" />
                    </div>
                    <Input
                      className="h-12 border-glass-border bg-background/50 pl-10 transition-all focus:border-gaming-primary focus:ring-gaming-primary/20"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      type="password"
                      value={field.state.value}
                    />
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p
                      className="text-destructive text-sm"
                      key={error?.message}
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            {/* Submit Button */}
            <form.Subscribe>
              {(state) => (
                <Button
                  className="btn-gaming h-12 w-full font-semibold text-base"
                  disabled={!state.canSubmit || state.isSubmitting}
                  type="submit"
                >
                  <RocketIcon className="mr-2 size-4" />
                  {state.isSubmitting ? m.submitting() : m.signUp()}
                </Button>
              )}
            </form.Subscribe>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-glass-border border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Switch to Sign In */}
          <div className="text-center">
            <Button
              className="text-gaming-primary transition-colors hover:text-gaming-secondary"
              render={<Link to="/login" />}
              variant="link"
            >
              {m.alreadyHaveAccount()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
