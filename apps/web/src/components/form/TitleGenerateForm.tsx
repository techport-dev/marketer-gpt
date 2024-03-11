"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import titleGenerateFormSchema from "./schemas/titleGenerateFormSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormRender, { type FormType } from "./common/FormRender";
import { Button } from "@/components/ui/button";

const formFields = [
  {
    key: 1,
    name: "titleType",
    label: "Title Type",
    type: "select",
    options: [
      { key: 1, value: "image", label: "Image" },
      { key: 2, value: "text", label: "Text" },
      { key: 3, value: "imageText", label: "Image & Text" },
    ],
    defaultValue: "imageText",
  },
  {
    key: 2,
    name: "images",
    label: "Upload Image",
    type: "file",
  },
  {
    key: 3,
    name: "imageDescription",
    label: "Image Description",
    type: "textarea",
  },
  {
    key: 4,
    name: "subreddit",
    label: "Subreddit",
    type: "input",
  },
  {
    key: 5,
    name: "lengthLimit",
    label: "Length Limit",
    type: "input",
  },
  {
    key: 6,
    name: "avoidenceKeywords",
    label: "Avoidence Keywords",
    type: "input",
  },
  {
    key: 7,
    name: "reference",
    label: "Reference",
    type: "input",
  },
];

export type FormFieldsType =
  | "images"
  | "imageDescription"
  | "subreddit"
  | "lengthLimit"
  | "avoidenceKeywords"
  | "reference";

const TitleGenerateForm = () => {
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof titleGenerateFormSchema>>({
    resolver: zodResolver(titleGenerateFormSchema),
    defaultValues: {
      titleType: "",
      images: new File([], ""),
      imageDescription: "",
      subreddit: "",
      lengthLimit: "",
      avoidenceKeywords: "",
      reference: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: any) => {
    console.log("onSubmit values are ", values);
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {formFields.map((formField) => (
            <FormField
              key={formField.key}
              control={form.control}
              name={formField.name as FormFieldsType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                    {formField.label}
                  </FormLabel>
                  <FormControl>
                    <FormRender
                      type={formField.type as FormType}
                      field={field}
                      options={formField.options}
                      defaultValue={formField.defaultValue}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </FormProvider>
  );
};

export default TitleGenerateForm;
