"use client";

import useFileuploadDropzone from "@/hooks/useFileuploadDropzone";
import { FC, useMemo, useState } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { useFormContext, type ControllerRenderProps } from "react-hook-form";
import { type FormFieldsType } from "../../TitleGenerateForm";
import FilePreview from "./FilePreview";

export type FileWithPreview = File & { preview: string };

export type FileuploadProps = {
  options?: DropzoneOptions;
  field: ControllerRenderProps<
    {
      images: File;
      imageDescription: string;
      subreddit: string;
      lengthLimit: string;
      avoidenceKeywords: string;
      reference: string;
    },
    FormFieldsType
  >;
};

const focusedStyle = {
  borderColor: "#3b82f6",
};

const acceptStyle = {
  borderColor: "#3b82f6",
  backgroundColor: "#E8F0FE",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

type DragDropUIProps = {
  isDragAccept: boolean;
  isDragReject: boolean;
  open: () => void;
};

const DragDropUI: FC<DragDropUIProps> = ({
  isDragAccept,
  isDragReject,
  open,
}) => {
  return (
    <>
      {isDragAccept ? (
        <div className="flex justify-center items-center min-h-24">
          <p className="text-blue-500">Drop an image here</p>
        </div>
      ) : isDragReject ? (
        <div className="flex justify-center items-center min-h-24">
          <p className="text-red-500">Invalid file type</p>
        </div>
      ) : (
        <div className="min-h-24">
          <div className="flex justify-center items-center mb-3">
            <ArrowUpTrayIcon className="h-8 w-8" />
          </div>

          <p className="text-sm">
            Drag an image here or{" "}
            <span
              className="text-blue-600 font-semibold underline cursor-pointer"
              onClick={open}
            >
              upload a file
            </span>
          </p>
          <em className="text-sm">
            (Only *.jpeg and *.png images will be accepted)
          </em>
        </div>
      )}
    </>
  );
};

const Fileupload: FC<FileuploadProps> = ({ field, options }) => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
    files,
    setFiles,
  } = useFileuploadDropzone({ field, options });

  const style = useMemo(
    () => ({
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragAccept, isDragReject, isFocused]
  );

  const fileToDataUrl = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <section>
      <div
        {...getRootProps({
          style: style,
        })}
        className={`border-2 border-dashed border-gray-300 rounded-md p-8 text-center transition-colors flex-1 `}
      >
        <Input {...getInputProps()} type="file" />
        <DragDropUI
          isDragAccept={isDragAccept}
          isDragReject={isDragReject}
          open={open}
        />
      </div>

      <FilePreview files={files} setFiles={setFiles} />
    </section>
  );
};

export default Fileupload;
