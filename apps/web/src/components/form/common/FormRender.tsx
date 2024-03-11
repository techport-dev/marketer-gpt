import React, { FC } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";
import { type FormFieldsType } from "../TitleGenerateForm";
import Fileupload from "./Fileupload";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FormType =
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "file";

type FormRenderProps = {
  type: FormType;
  field: any;
  options?: Array<{ key: number; value: string; label: string }>;
  defaultValue?: string;
};

const FormRender: FC<FormRenderProps> = ({
  type,
  field,
  options,
  defaultValue,
}) => {
  switch (type) {
    case "input":
      return <Input {...field} />;
    case "textarea":
      return <Textarea {...field} />;
    case "file":
      return <Fileupload field={field} />;
    case "select":
      return (
        <Select
          onValueChange={(value) => value && field.onChange(value)}
          value={field.vlaue}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a title" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options?.map((option) => (
                <SelectItem key={option.key} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    default:
      <Input {...field} />;
    // default:
    //   return <Input {...field} value={field.value as string} />;
  }
};

export default FormRender;
