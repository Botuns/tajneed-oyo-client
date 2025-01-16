"use client";

import { useState } from "react";
import {
  ChevronDown,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { OfficeFilters } from "@/app/types/office";
import { useOffices } from "@/hooks/office/queries/useOffices";

export function OfficeTable() {
  const [filters, setFilters] = useState<OfficeFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isFetching } = useOffices(filters);
  const offices = data?.data ?? [];
  //   function DisplayMessage() {
  //     if (data?.status === "success") {
  //       toast.success(data?.message);
  //     } else {
  //       toast.error(data?.message);
  //     }
  //   }
  //   DisplayMessage();
  const totalOffices = (data?.data.length as number) ?? (0 as number);
  const totalPages = Math.ceil(totalOffices / filters.limit);

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleSort = (sortBy: OfficeFilters["sortBy"]) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-[200px]" />
            <Skeleton className="h-12 w-[200px]" />
            <Skeleton className="h-12 w-[300px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search offices..."
            className="pl-8"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[50px]">
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => handleSort("totalOfficers")}
                >
                  Officers
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Responsibilities</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offices.map((office) => (
              <TableRow key={office._id}>
                <TableCell className="font-medium">{office.name}</TableCell>
                <TableCell>{office.email}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {office.description}
                </TableCell>
                <TableCell>{office.totalOfficers}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {office.responsibilities.map((resp, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs font-medium w-fit"
                      >
                        {resp}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isFetching ? (
            <Skeleton className="h-4 w-[200px]" />
          ) : (
            `Showing ${offices.length} of ${totalOffices} offices`
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={filters.page === 1 || isFetching}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={filters.page === totalPages || isFetching}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
