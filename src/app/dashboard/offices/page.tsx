"use client";
import { Suspense } from "react";
import { OfficeTable } from "./office-table";
// import { CreateOfficeDialog } from "./create-office-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfficeDashboard() {
  const router = useRouter();
  // function to navigate to /create
  function navigateToCreateOffice() {
    // navigate to create office page
    router.push("offices/create");
  }
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offices</h1>
          <p className="text-muted-foreground">
            Manage and monitor all office locations and their officers.
          </p>
        </div>
        {/* <CreateOfficeDialog /> */}
        {/* button to navigate to create an office */}
        <Button onClick={navigateToCreateOffice} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Create Office
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Officers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Officers per Office
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Office Locations</CardTitle>
          <CardDescription>
            A list of all offices and their key information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <OfficeTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
