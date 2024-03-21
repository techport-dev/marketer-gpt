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
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "@/lib/redux/store";
import { aiResponseSlice } from "@/lib/redux/slices/aiResponse";
import { useMutation } from "@tanstack/react-query";
import { generateCommentMutation } from "@/lib/tanstackQuery/api/aiResponseApi";

const formFields = [
  {
    key: 1,
    name: "commentType",
    label: "Comment Type",
    type: "select",
    options: [
      {
        key: 1,
        label: "Post Reply",
        value: "postReply",
      },
      {
        key: 2,
        label: "Comment Reply",
        value: "commentReply",
      },
      {
        key: 3,
        label: "Followup Comment Reply",
        value: "followupCommentReply",
      },
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

  const mutation = useMutation({
    mutationFn: generateCommentMutation,
    onMutate: () => {
      dispatch(aiResponseSlice.actions.setIsLoading());
    },
    onSuccess: (data) => {
      console.log("the data is ", data);
      dispatch(aiResponseSlice.actions.setIsSuccess(data));
    },
    onError: (error) => {
      console.error("the error is ", error.message);
      dispatch(aiResponseSlice.actions.setIsError(error.message));
    },
  });

  const dispatch = useDispatch();

  const onSubmit = (values: z.infer<typeof commentGenerateFormSchema>) => {
    console.log("onSubmit values are ", values);

    mutation.mutate(values);
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
