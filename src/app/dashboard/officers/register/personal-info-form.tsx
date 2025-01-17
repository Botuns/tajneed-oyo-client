import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { UserType } from "@/app/types/user";

export function PersonalInfoForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const isAdmin = watch("isAdmin");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message as string}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message as string}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...register("phone")} />
        {errors.phone && (
          <p className="text-sm text-red-500">
            {errors.phone.message as string}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label>User Type</Label>
        <RadioGroup
          defaultValue={UserType.OFFICER}
          onValueChange={(value) => setValue("userType", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={UserType.ADMIN} id="regular" />
            <Label htmlFor="regular">Admin</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={UserType.GUEST} id="supervisor" />
            <Label htmlFor="supervisor">Guest</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isAdmin"
          checked={isAdmin}
          onCheckedChange={(checked: boolean) => setValue("isAdmin", checked)}
        />
        <Label htmlFor="isAdmin">Is Admin</Label>
      </div>
      <div className="space-y-2">
        <Label>Tenure Start</Label>
        <DatePicker onChange={(date) => setValue("tenureStart", date)} />
      </div>
      <div className="space-y-2">
        <Label>Tenure End</Label>
        <DatePicker onChange={(date) => setValue("tenureEnd", date)} />
      </div>
    </div>
  );
}
