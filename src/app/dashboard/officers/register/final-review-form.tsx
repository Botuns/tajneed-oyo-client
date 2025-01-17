import { useOffices } from "@/hooks/office/queries/useOffices";
import { useFormContext } from "react-hook-form";

export function FinalReviewForm() {
  const { watch } = useFormContext();
  const formData = watch();
  const { data: officesData } = useOffices({ page: 1, limit: 100 });

  const offices = officesData?.data || [];
  const selectedOffices = offices.filter((office) =>
    formData.offices.includes(office._id)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Personal Information</h3>
          <p>Name: {formData.name}</p>
          <p>Email: {formData.email}</p>
          <p>Phone: {formData.phone}</p>
          <p>User Type: {formData.userType}</p>
          <p>Is Admin: {formData.isAdmin ? "Yes" : "No"}</p>
          <p>Tenure Start: {formData.tenureStart.toDateString()}</p>
          <p>Tenure End: {formData.tenureEnd.toDateString()}</p>
        </div>
        <div>
          <h3 className="font-semibold">Selected Offices</h3>
          <ul>
            {selectedOffices.map((office) => (
              <li key={office._id}>{office.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3 className="font-semibold">Biometric Information</h3>
        <p>Fingerprint: {formData.fingerprint ? "Captured" : "Not captured"}</p>
      </div>
      <div>
        <h3 className="font-semibold">Unique Code</h3>
        <p>{formData.uniqueCode}</p>
      </div>
    </div>
  );
}
