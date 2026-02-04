import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/ytta/contact")({
  component: AdminContactPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      orpc.contact.getAll.queryOptions()
    );
  },
});

function AdminContactPage() {
  const contactQuery = useSuspenseQuery(orpc.contact.getAll.queryOptions());
  const submissions = contactQuery.data.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl md:text-3xl">Contact Submissions</h1>
        <p className="text-muted-foreground">
          View messages from the contact form
        </p>
      </div>

      {/* Table */}
      <Card className="gaming-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareIcon className="size-5 text-gaming-primary" />
            Messages
          </CardTitle>
          <CardDescription>
            {contactQuery.data.total} submissions in total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="py-12 text-center">
              <MessageSquareIcon className="mx-auto size-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                No contact submissions yet
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-hidden rounded-lg border border-glass-border md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow
                        className="transition-colors hover:bg-muted/20"
                        key={submission.id}
                      >
                        <TableCell className="font-medium">
                          {submission.name}
                        </TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {submission.question}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 md:hidden">
                {submissions.map((submission) => (
                  <div
                    className="rounded-lg border border-glass-border p-4"
                    key={submission.id}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{submission.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mb-1 text-muted-foreground text-sm">
                      {submission.email}
                    </p>
                    <p className="text-sm">{submission.question}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
