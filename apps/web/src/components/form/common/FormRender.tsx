import React, { FC } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";
import { type FormFieldsType } from "../TitleGenerateForm";
import Fileupload from "./Fileupload";

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
};

const FormRender: FC<FormRenderProps> = ({ type, field }) => {
  switch (type) {
    case "input":
      return <Input {...field} />;
    case "textarea":
      return <Textarea {...field} />;
    case "file":
      return <Fileupload field={field} />;
    default:
      <Input {...field} />;
    // default:
    //   return <Input {...field} value={field.value as string} />;
  }
};

export default FormRender;
