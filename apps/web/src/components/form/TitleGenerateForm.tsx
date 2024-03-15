"use client";

import React, { useEffect, useState } from "react";
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
import axios from "axios";
import useSessionStorage from "@/hooks/useSessionStorage";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "@/lib/redux/store";
import { selectImage } from "@/lib/redux/slices/image/selectors";

const formFields = [
  {
    key: 1,
    name: "titleType",
    label: "Title Type",
    type: "select",
    options: [
      { key: 1, value: "imageText", label: "Image & Text" },
      { key: 2, value: "image", label: "Image" },
      { key: 3, value: "text", label: "Text" },
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
  const [messageData, setMessageData] = useSessionStorage<
    Array<Record<string, string>>
  >("message", []);

  const imageState = useSelector(selectImage);

  const form = useForm<z.infer<typeof titleGenerateFormSchema>>({
    resolver: zodResolver(titleGenerateFormSchema),
    defaultValues: {
      titleType: "imageText",
      images: new File([], ""),
      imageDescription: "",
      subreddit: "",
      lengthLimit: "",
      avoidenceKeywords: "",
      reference: "",
    },
    mode: "onChange",
  });

  const titleType = form.getValues("titleType");

  useEffect(() => {
    const fieldsToUnregister =
      titleType === "image"
        ? ["imageDescription"]
        : titleType === "text"
          ? ["images"]
          : [];

    fieldsToUnregister.forEach((fieldName) => {
      form.unregister(fieldName as FormFieldsType);
    });
  }, [form, titleType]);

  const filterFormFields = (formField: any) => {
    // Directly return the opposite of the condition you're checking for.
    // This makes the function more concise and easier to understand.
    if (
      (titleType === "image" && formField.name === "imageDescription") ||
      (titleType === "text" && formField.name === "images")
    ) {
      return false;
    }
    return true;
  };

  const onSubmit = (values: any) => {
    const newData = [
      ...messageData,
      {
        ...values,
        role: "user",
        generationType: "Title",
        id: uuidv4(),
        base64Image: imageState?.referenceImages[0],
      },
    ];

    console.log("newData is ", newData);

    setMessageData(newData);

    // axios({
    //   method: "POST",
    //   url: "http://localhost:5000/api/v1/gpt/aiResponse",
    //   data: newData,
    // })
    //   .then((res) => {
    //     console.log("the response is ", res.data);
    //   })
    //   .catch((err) => {
    //     console.error("the error is ", err.message);
    //   });
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {formFields.filter(filterFormFields).map((formField) => (
            <FormField
              key={formField.key}
              control={form.control}
              name={formField.name as FormFieldsType}
              render={({ field }) => (
                <>
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
                </>
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
