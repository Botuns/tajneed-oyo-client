import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { UserType } from "@/app/types/user";
import { PositionType } from "@/app/types/officer";

export function PersonalInfoForm() {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

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
        <Label htmlFor="position">Position Title</Label>
        <Input
          id="position"
          placeholder="e.g., Nazim Tabligh"
          {...register("position")}
        />
        {errors.position && (
          <p className="text-sm text-red-500">
            {errors.position.message as string}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Position Type</Label>
        <RadioGroup
          defaultValue={PositionType.HEAD}
          onValueChange={(value) => setValue("positionType", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={PositionType.EXECUTIVE} id="executive" />
            <Label htmlFor="executive">
              Executive (State Qaid, Mut&apos;amad)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={PositionType.HEAD} id="head" />
            <Label htmlFor="head">Head (Nazim)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={PositionType.ASSISTANT} id="assistant" />
            <Label htmlFor="assistant">Assistant (Naib)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={PositionType.SPECIAL} id="special" />
            <Label htmlFor="special">Special (Muhasib, Murabiy)</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dila">Dila (Local Jamaat)</Label>
        <Input
          id="dila"
          placeholder="e.g., Ibadan, Monatan"
          {...register("dila")}
        />
        {errors.dila && (
          <p className="text-sm text-red-500">
            {errors.dila.message as string}
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
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={UserType.OFFICER} id="officer" />
            <Label htmlFor="officer">Officer</Label>
          </div>
        </RadioGroup>
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
