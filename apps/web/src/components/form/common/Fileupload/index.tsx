"use client";

import useFileuploadDropzone from "@/hooks/useFileuploadDropzone";
import { FC, useState } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { toast } from "sonner";

export type FileWithPreview = File & { preview: string };

type FileuploadProps = {
  options?: DropzoneOptions;
};

const Fileupload: FC<FileuploadProps> = ({ options }) => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
    files,
    setFiles,
  } = useFileuploadDropzone({ options });

  return null; // Replace null with your desired JSX code
};

export default Fileupload;
