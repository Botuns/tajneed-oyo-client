import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useOffices } from "@/hooks/office/queries/useOffices";

export function OfficeSelectionForm() {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const selectedOffices = watch("offices") || [];
  const { data: officesData, isLoading } = useOffices({ page: 1, limit: 100 });

  if (isLoading) {
    return <div>Loading offices...</div>;
  }

  const offices = officesData?.data || [];

  const handleOfficeChange = (officeId: string, checked: boolean) => {
    const updatedOffices = checked
      ? [...selectedOffices, officeId]
      : selectedOffices.filter((id: string) => id !== officeId);
    setValue("offices", updatedOffices);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Offices</h2>
      <div className="grid grid-cols-2 gap-4">
        {offices.map((office) => (
          <div key={office._id} className="flex items-center space-x-2">
            <Checkbox
              id={office._id}
              checked={selectedOffices.includes(office._id)}
              onCheckedChange={(checked) =>
                handleOfficeChange(office._id, checked as boolean)
              }
            />
            <Label htmlFor={office._id}>{office.name}</Label>
          </div>
        ))}
      </div>
      {errors.offices && (
        <p className="text-sm text-red-500">
          {errors.offices.message as string}
        </p>
      )}
    </div>
  );
}
