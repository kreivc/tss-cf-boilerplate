import { createFileRoute, Navigate } from "@tanstack/react-router";
import { env } from "@test-tss/env/web";
import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const isRegisterDisabled = env.VITE_DISABLE_REGISTER;

  if (isRegisterDisabled) {
    return <Navigate to="/login" />;
  }

  return <SignUpForm />;
}
