"use client";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const data: WebsiteDetails[] = [
  {
    name: "Artify",
    url: "https://artify.ronitghosh.site",
    responseMs: 100,
    statusCode: 200,
    lastChecked: "5 minutes ago",
  },
  {
    name: "Viora",
    url: "https://viora.ronitghosh.site",
    responseMs: 120,
    statusCode: 200,
    lastChecked: "2 minutes ago",
  },
  {
    name: "Zero Downtime",
    url: "https://zero-downtime.ronitghosh.site",
    responseMs: 95,
    statusCode: 400,
    lastChecked: "1 minute ago",
  },
  {
    name: "Ignite Studios",
    url: "https://ignite.ronitghosh.site",
    responseMs: 150,
    statusCode: 400,
    lastChecked: "10 minutes ago",
  },
  {
    name: "TPSystelink",
    url: "https://tpsystelink.in",
    responseMs: 110,
    statusCode: 200,
    lastChecked: "3 minutes ago",
  },
];

export type WebsiteDetails = {
  name: string;
  url: string;
  responseMs: number;
  errorCode?: string;
  statusCode: number;
  lastChecked: string;
};

export const columns: ColumnDef<WebsiteDetails>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="text-[#eee] capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <div className="text-[#eee] lowercase">{row.getValue("url")}</div>
    ),
  },
  {
    accessorKey: "responseMs",
    header: "Response (ms)",
    cell: ({ row }) => (
      <div className="text-center text-[#eee] lowercase">
        {row.getValue("responseMs")} ms
      </div>
    ),
  },
  {
    accessorKey: "statusCode",
    header: "Status Code",
    cell: ({ row }) => {
      const value = row.getValue("statusCode") as number;
      return (
        <div className="text-center font-medium">
          <p
            className={cn(
              `${value !== 200 ? "bg-[#3B0606] text-[#FB6868]" : "bg-[#20063B] text-[#8F68FB]"}`,
              "mx-auto w-12 rounded-full py-1",
            )}
          >
            {value}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "errorCode",
    header: "Error Code",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium text-[#eee]">
          {row.getValue("errorCode") || "None"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 bg-transparent p-0 text-[#eee] hover:bg-blue-800/10">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-gradient-to-tl from-[#0A071E] to-[#040116]"
            align="end"
          >
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.url)}
            >
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Visit Website</DropdownMenuItem>
            <DropdownMenuItem>Edit Website</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              Delete Website{" "}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Dashboard() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault(); // optional: prevent default browser behavior
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-20">
      <h2
        className={cn(
          "font-outline-1 bg-clip-text text-4xl text-transparent sm:text-5xl",
          "bg-gradient-to-r from-[#ccc1f1] to-[#F6F6FE] pb-6",
        )}
      >
        Add your website
      </h2>
      <div className="flex items-center py-4">
        <div className="relative mr-2 w-full">
          <Input
            ref={searchInputRef}
            placeholder="Search..."
            value={(table.getColumn("url")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("url")?.setFilterValue(event.target.value)
            }
            className="h-12"
          />
          <Button
            className="absolute top-1.5 right-2 bg-[#1c0f47] text-[#714ce9] hover:bg-[#1c0f47]"
            size="icon"
          >
            /
          </Button>
        </div>
        <Button variant="custom" className="mr-2 ml-auto">
          Search
          <IconSearch />{" "}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="custom" className="ml-auto">
              Columns <IconChevronDown />{" "}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-gradient-to-tl from-[#0A071E] to-[#040116]"
            align="end"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md">
        <Table className="border-none">
          <TableHeader className="border-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="border-b hover:bg-[#040116]/10"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header, i) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`${i === 0 || i === 1 ? "text-left" : "text-center"}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="border-b hover:bg-[#040116]/50"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
