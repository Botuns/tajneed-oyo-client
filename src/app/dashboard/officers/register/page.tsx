"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { PersonalInfoForm } from "./personal-info-form";
import { OfficeSelectionForm } from "./office-selection-form";
import { BiometricForm } from "./biometric-form";
import { FinalReviewForm } from "./final-review-form";
import { Button } from "@/components/ui/button";
import { generateUniqueCode } from "@/app/utils/unique-code";
import { useCreateOfficer } from "@/hooks/officer/mutations/useCreateOfficer";
import { ICreateOfficerDto } from "@/app/types/officer";
import { UserType } from "@/app/types/user";
import { PositionType } from "@/app/types/officer";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  position: z.string().min(2, "Position title is required"),
  positionType: z.nativeEnum(PositionType),
  dila: z.string().min(2, "Dila (local jamaat) is required"),
  offices: z.array(z.string()).min(1, "Select at least one office"),
  userType: z.nativeEnum(UserType),
  isAdmin: z.boolean(),
  tenureStart: z.date(),
  tenureEnd: z.date(),
  fingerprint: z.string().optional(),
  uniqueCode: z.string(),
  phoneNumber: z.string().optional(),
});

const steps = ["Personal Info", "Office Selection", "Biometrics", "Review"];

export default function OfficerRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const createOfficer = useCreateOfficer();

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      positionType: PositionType.HEAD,
      dila: "",
      offices: [],
      fingerprint: "",
      userType: UserType.OFFICER,
      isAdmin: false,
      tenureStart: new Date(),
      tenureEnd: new Date(),
      uniqueCode: generateUniqueCode(),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const nameParts = data.name.split(" ");
      const dto: ICreateOfficerDto = {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: data.email,
        phoneNumber: data.phone,
        position: data.position,
        positionType: data.positionType,
        dila: data.dila,
        tenureStart: data.tenureStart.toISOString(),
        tenureEnd: data.tenureEnd?.toISOString(),
        offices: data.offices,
        isAdmin: data.isAdmin,
      };
      await createOfficer.mutateAsync(dto);
      // Handle success (e.g., show success message, redirect)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(String(error));
      }
      // Error is handled by the mutation
    }
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg  p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Officer Registration
        </h1>
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-sm">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <PersonalInfoForm />}
                {currentStep === 1 && <OfficeSelectionForm />}
                {currentStep === 2 && <BiometricForm />}
                {currentStep === 3 && <FinalReviewForm />}
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex justify-between">
              {currentStep > 0 && (
                <Button type="button" onClick={prevStep} variant="outline">
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={createOfficer.isPending}>
                  {createOfficer.isPending ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
