import React, { FC } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormType = "input" | "textarea" | "select" | "checkbox" | "radio" | "file";

type FormRenderProps = {
  type: FormType;
};

const FormRender: FC<FormRenderProps> = ({ type }) => {
  switch (type) {
    case "input":
      return <Input />;
    case "textarea":
      return <Textarea />;
    default:
      return <Input />;
  }
};

export default FormRender;
