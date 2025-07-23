"use client";
import {
  IconArrowLeft,
  IconChevronDown,
  IconPlus,
} from "@tabler/icons-react";
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
import { BACKEND_URL, cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { toast } from "sonner";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";

interface WebsiteTick {
  responseTimeMs: number;
  errorCode: number | null;
  statusCode: number;
  updatedAt: string;
}

interface WebsiteDetails {
  id: string;
  name: string;
  url: string;
  isTracking: boolean;
  websiteTicks: WebsiteTick[];
}

export const columns: ColumnDef<WebsiteTick>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "responseTimeMs",
    header: "Response (ms)",
    accessorKey: "responseTimeMs",
    cell: ({ row }) => (
      <div className="pl-10 text-[#eee]">
        {row.original.responseTimeMs ?? "N/A"}
      </div>
    ),
  },
  {
    id: "statusCode",
    header: "Status Code",
    accessorKey: "statusCode",
    cell: ({ row }) => {
      const value = row.original.statusCode;
      return (
        <div className="text-center font-medium">
          <p
            className={cn(
              `${value !== 200 ? "bg-[#3B0606] text-[#FB6868]" : "bg-[#20063B] text-[#8F68FB]"}`,
              "mx-auto w-12 rounded-full py-1",
            )}
          >
            {value ?? "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    id: "errorCode",
    header: "Error Code",
    accessorKey: "errorCode",
    cell: ({ row }) => {
      const errorCode = row.original.errorCode;
      return (
        <div className="text-center font-medium text-[#eee]">
          {errorCode ?? "None"}
        </div>
      );
    },
  },
  {
    id: "updatedAt",
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      const timeAgo = formatDistanceToNowStrict(new Date(updatedAt), {
        addSuffix: true,
      });

      return <div className="text-center text-[#eee]">{timeAgo}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const tick = row.original;
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
              onClick={() => navigator.clipboard.writeText(tick.updatedAt)}
            >
              Copy Timestamp
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-red-500">
              Delete Entry
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function WebsiteDetailsComponent(param: {
  id: string | string[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<WebsiteTick[]>([]);
  const [allData, setAllData] = React.useState<WebsiteDetails>();
  const [reload, setReload] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  React.useEffect(() => {
    (async function fetchWebsiteTicks() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/website/get/id?id=${param.id}`,
        );
        if (!response) {
          toast("Please reload!");
          return;
        }
        setAllData(response.data.website);
        const websiteTicks = response.data.website.websiteTicks || [];
        setData(websiteTicks);
      } catch (error) {
        console.error(error);
        toast("Error loading website data");
      } finally {
      }
    })();
  }, [param.id, reload]);

  const handleSwitch = async (event: boolean) => {
    if (!allData?.id) return;
    try {
      const response = await axios.post(`${BACKEND_URL}/api/website/switch`, {
        websiteId: allData.id,
        isTracking: event,
      });
      toast(
        `Website checking is turned ${response.data.isTracking ? "on" : "off"}`,
      );
      setReload("true");
    } catch (error) {
      toast("Try again!");
      console.error(error);
    }
  };

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
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="mb-10 bg-transparent"
      >
        <IconArrowLeft className="size" />
        Back
      </Button>
      <div className="flex items-center gap-3">
        <h2
          className={cn(
            "font-outline-1 bg-clip-text text-4xl text-transparent sm:text-5xl",
            "bg-gradient-to-r from-[#ccc1f1] to-[#F6F6FE] pb-6 capitalize",
          )}
        >
          {allData?.name}
        </h2>
        {allData && (
          <Switch
            onCheckedChange={(e) => handleSwitch(e)}
            checked={allData?.isTracking}
            className="mb-4 cursor-pointer"
          />
        )}
      </div>
      <div className="flex items-center py-4">
        <div className="relative mr-2 w-full">
          <Input
            ref={searchInputRef}
            placeholder="Search by response time or status..."
            value={
              (table.getColumn("responseTimeMs")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("responseTimeMs")
                ?.setFilterValue(event.target.value)
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
        <Button
          onClick={() => router.push("/add-website")}
          variant="custom"
          className="mr-2 ml-auto py-6"
        >
          Add
          <IconPlus />{" "}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="custom" className="ml-auto py-6">
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
                  No website monitoring data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
