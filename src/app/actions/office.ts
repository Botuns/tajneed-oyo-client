"use server";

import { OfficeFilters } from "../types/office";

export async function getOffices(filters: OfficeFilters) {
  try {
    const searchParams = new URLSearchParams();
    if (filters.search) searchParams.append("search", filters.search);
    if (filters.sortBy) searchParams.append("sortBy", filters.sortBy);
    if (filters.sortOrder) searchParams.append("sortOrder", filters.sortOrder);
    searchParams.append("page", filters.page.toString());
    searchParams.append("limit", filters.limit.toString());

    const response = await fetch(`/api/offices?${searchParams.toString()}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching offices:", error);
    throw new Error("Failed to fetch offices");
  }
}
