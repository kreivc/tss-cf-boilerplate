import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { m } from "@/paraglide/messages";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline">{m.signIn()}</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{m.myAccount()}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          {session.user.role?.toLowerCase() === "admin" && (
            <DropdownMenuItem
              onClick={() => {
                navigate({
                  to: "/ytta",
                });
              }}
            >
              Admin
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                credentials: "include",
                onSuccess: () => {
                  navigate({
                    to: "/",
                  });
                  toast.success(m.signOutSuccess());
                },
              },
            });
          }}
          variant="destructive"
        >
          {m.signOut()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
