import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  FileTextIcon,
  FilterIcon,
  Gamepad2Icon,
  RefreshCwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/ytta/reports")({
  component: ReportsPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpc.game.getAll.queryOptions());
  },
});

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SUCCESS", label: "Success" },
  { value: "FAILED", label: "Failed" },
] as const;

// Helper to get today's date in UTC as YYYY-MM-DD format
const getTodayUTC = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

// Transaction type for the query result
interface TransactionData {
  id: string;
  referenceId: string | null;
  game: { name: string } | null;
  item: { name: string } | null;
  totalPrice: number;
  status: string;
  createdAt: string | null;
}

interface TransactionsQueryResult {
  data: TransactionData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper function to render transactions content with early returns
// This avoids nested ternary expressions
interface TransactionsContentProps {
  transactionsQuery: {
    isLoading: boolean;
    error: Error | null;
    data?: TransactionsQueryResult;
    refetch: () => void;
  };
  clearFilters: () => void;
  hasActiveFilters: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (dateString: string | null) => string;
  formatCurrency: (amount: number, symbol?: string) => string;
  page: number;
  setPage: (page: number) => void;
}

function renderTransactionsContent({
  transactionsQuery,
  clearFilters,
  hasActiveFilters,
  getStatusBadge,
  formatDate,
  formatCurrency,
  page,
  setPage,
}: TransactionsContentProps): React.ReactNode {
  // Loading state
  if (transactionsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <RefreshCwIcon className="size-8 animate-spin text-gaming-primary" />
          <p className="text-muted-foreground text-sm">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (transactionsQuery.error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Failed to load transactions</p>
        <Button
          className="mt-4"
          onClick={() => transactionsQuery.refetch()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (transactionsQuery.data?.data.length === 0) {
    return (
      <div className="py-12 text-center">
        <SearchIcon className="mx-auto size-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">No transactions found</p>
        {hasActiveFilters && (
          <Button className="mt-4" onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  // Success state with data
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-lg border border-glass-border">
          <Table>
            <TableHeader>
              <TableRow className="border-glass-border bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Reference</TableHead>
                <TableHead className="font-semibold">Game</TableHead>
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsQuery.data?.data.map((txn) => (
                <TableRow className="border-glass-border" key={txn.id}>
                  <TableCell className="font-mono text-sm">
                    {txn.referenceId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-gaming-primary/20">
                        <Gamepad2Icon className="size-4 text-gaming-primary" />
                      </div>
                      <span className="font-medium">
                        {txn.game?.name ?? "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{txn.item?.name ?? "Unknown"}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(txn.totalPrice)}
                  </TableCell>
                  <TableCell>{getStatusBadge(txn.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(txn.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link params={{ orderId: txn.id }} to="/order/$orderId">
                      <Button size="sm" variant="ghost">
                        <EyeIcon className="size-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {transactionsQuery.data?.data.map((txn) => (
          <div
            className="rounded-xl border border-glass-border bg-background/50 p-4"
            key={txn.id}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-sm">{txn.referenceId}</span>
              {getStatusBadge(txn.status)}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gaming-primary/20">
                <Gamepad2Icon className="size-4 text-gaming-primary" />
              </div>
              <div>
                <p className="font-medium">{txn.game?.name ?? "Unknown"}</p>
                <p className="text-muted-foreground text-sm">
                  {txn.item?.name ?? "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gaming-primary">
                  {formatCurrency(txn.totalPrice)}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(txn.createdAt)}
                </p>
              </div>
              <Link params={{ orderId: txn.id }} to="/order/$orderId">
                <Button size="sm" variant="outline">
                  <EyeIcon className="mr-2 size-3" />
                  View
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {(transactionsQuery.data?.totalPages ?? 0) > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-muted-foreground text-sm">
            Page {page} of {transactionsQuery.data?.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              size="sm"
              variant="outline"
            >
              <ChevronLeftIcon className="mr-1 size-4" />
              Previous
            </Button>
            <Button
              disabled={page >= (transactionsQuery.data?.totalPages ?? 1)}
              onClick={() => setPage(page + 1)}
              size="sm"
              variant="outline"
            >
              Next
              <ChevronRightIcon className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function ReportsPage() {
  // Initialize with today's date in UTC
  const todayUTC = getTodayUTC();

  // Filters state
  const [status, setStatus] = useState<string>("all");
  const [gameId, setGameId] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>(todayUTC);
  const [endDate, setEndDate] = useState<string>(todayUTC);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Fetch games for filter dropdown
  const gamesQuery = useSuspenseQuery(orpc.game.getAll.queryOptions());

  // Build filter params
  const filterParams = {
    page,
    limit,
    ...(status !== "all" && {
      status: status as "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED",
    }),
    ...(gameId !== "all" && { gameId }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  // Fetch transactions with filters
  const transactionsQuery = useQuery(
    orpc.transaction.list.queryOptions({
      input: filterParams,
    })
  );

  const clearFilters = () => {
    setStatus("all");
    setGameId("all");
    setStartDate(todayUTC);
    setEndDate(todayUTC);
    setPage(1);
  };

  const hasActiveFilters =
    status !== "all" ||
    gameId !== "all" ||
    startDate !== todayUTC ||
    endDate !== todayUTC;

  const getStatusBadge = (txnStatus: string) => {
    switch (txnStatus) {
      case "PENDING":
        return (
          <Badge className="bg-amber-500/20 text-amber-500">Pending</Badge>
        );
      case "PROCESSING":
        return (
          <Badge className="bg-blue-500/20 text-blue-500">Processing</Badge>
        );
      case "SUCCESS":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-500">Success</Badge>
        );
      case "FAILED":
        return <Badge className="bg-red-500/20 text-red-500">Failed</Badge>;
      default:
        return <Badge variant="secondary">{txnStatus}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "-";
    }
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number, symbol = "$") => {
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">
            <span className="text-gradient-gaming">Transaction</span> Reports
          </h1>
          <p className="text-muted-foreground">
            View and filter all transaction history
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => transactionsQuery.refetch()}
            size="sm"
            variant="outline"
          >
            <RefreshCwIcon className="mr-2 size-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="gaming-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FilterIcon className="size-5 text-gaming-primary" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter transactions by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-glass-border bg-background/50 px-3 py-2 text-sm focus:border-gaming-primary focus:outline-none focus:ring-2 focus:ring-gaming-primary/20"
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Game Filter */}
            <div className="space-y-2">
              <Label>Game</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-glass-border bg-background/50 px-3 py-2 text-sm focus:border-gaming-primary focus:outline-none focus:ring-2 focus:ring-gaming-primary/20"
                onChange={(e) => setGameId(e.target.value)}
                value={gameId}
              >
                <option value="all">All Games</option>
                {gamesQuery.data.data.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className="relative">
                <Input
                  className="border-glass-border bg-background/50 pl-10"
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  value={startDate}
                />
                <CalendarIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <div className="relative">
                <Input
                  className="border-glass-border bg-background/50 pl-10"
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                  value={endDate}
                />
                <CalendarIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <Button onClick={clearFilters} size="sm" variant="outline">
                <XIcon className="mr-2 size-4" />
                Clear Filters
              </Button>
              <span className="text-muted-foreground text-sm">
                {transactionsQuery.data?.total ?? 0} results found
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card className="gaming-card">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="size-5 text-gaming-primary" />
              Transactions
            </CardTitle>
            <span className="text-muted-foreground text-sm">
              Showing {transactionsQuery.data?.data.length ?? 0} of{" "}
              {transactionsQuery.data?.total ?? 0} transactions
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {renderTransactionsContent({
            clearFilters,
            formatCurrency,
            formatDate,
            getStatusBadge,
            hasActiveFilters,
            page,
            setPage,
            transactionsQuery,
          })}
        </CardContent>
      </Card>
    </div>
  );
}
