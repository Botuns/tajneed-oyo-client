"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Office name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  responsibilities: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, { message: "Responsibility cannot be empty." }),
      })
    )
    .min(1, {
      message: "Please add at least one responsibility.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateOfficeForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      responsibilities: [{ value: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "responsibilities",
    control: form.control,
  });

  function onSubmit(data: FormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Office Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter office name" {...field} />
              </FormControl>
              <FormDescription>
                The official name of the office or department.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Office Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="office@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The official email address for this office.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a brief description of the office's purpose and function"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a concise overview of the office&apos;s role and
                objectives.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <div className="mb-4 flex items-center justify-between">
            <FormLabel className="text-base">Responsibilities</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: "" })}
            >
              Add Responsibility
            </Button>
          </div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`responsibilities.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input {...field} />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                        className={cn(index === 0 && "hidden")}
                      >
                        ✕
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <FormMessage>
            {form.formState.errors.responsibilities?.root?.message}
          </FormMessage>
        </div>
        <Button type="submit" className="w-full">
          Create Office
        </Button>
      </form>
    </Form>
  );
}
