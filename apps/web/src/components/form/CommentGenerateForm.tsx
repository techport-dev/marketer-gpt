"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormRender, { type FormType } from "./common/FormRender";

import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import commentGenerateFormSchema from "./schemas/commentGenerateFormSchema";

const formFields = [
  {
    key: 1,
    name: "commentType",
    label: "Comment Type",
    type: "select",
    options: [
      { key: 1, value: "postReply", label: "PostReply" },
      { key: 2, value: "commentReply", label: "CommentReply" },
      { key: 3, value: "followupCommentReply", label: "FollowupCommentReply" },
    ],
    defaultValue: "postReply",
  },
  {
    key: 2,
    name: "url",
    label: "Url",
    type: "input",
  },
];

type FormFieldsType = "commentType" | "url";

const CommentGenerateForm = () => {
  const form = useForm<z.infer<typeof commentGenerateFormSchema>>({
    resolver: zodResolver(commentGenerateFormSchema),
    defaultValues: {
      commentType: "postReply",
      url: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof commentGenerateFormSchema>) => {
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

export default CommentGenerateForm;
