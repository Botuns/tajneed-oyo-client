"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { OfficeFilters, IOffice } from "@/app/types/office";
import { useOffices } from "@/hooks/office/queries/useOffices";
import { officeService } from "@/app/services/office";

export function OfficeTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = React.useState<OfficeFilters>({
    page: 1,
    limit: 10,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [officeToDelete, setOfficeToDelete] = React.useState<IOffice | null>(null);

  const { data, isLoading, isFetching } = useOffices(filters);
  const offices = data?.data ?? [];
  const totalOffices = offices.length;
  const totalPages = Math.ceil(totalOffices / filters.limit);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => officeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      setDeleteDialogOpen(false);
      setOfficeToDelete(null);
    },
  });

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

  const handleView = (id: string) => {
    router.push(`/dashboard/offices/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/offices/${id}/edit`);
  };

  const handleDeleteClick = (office: IOffice) => {
    setOfficeToDelete(office);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (officeToDelete) {
      deleteMutation.mutate(officeToDelete._id);
    }
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
    <>
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
                      {office.responsibilities.slice(0, 2).map((resp, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs font-medium w-fit"
                        >
                          {resp}
                        </span>
                      ))}
                      {office.responsibilities.length > 2 && (
                        <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          +{office.responsibilities.length - 2}
                        </span>
                      )}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleView(office._id)}>
                          <Eye className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(office._id)}>
                          <Edit className="mr-2 size-4" />
                          Edit Office
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(office)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete office?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              office &ldquo;{officeToDelete?.name}&rdquo; and remove all officer assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
