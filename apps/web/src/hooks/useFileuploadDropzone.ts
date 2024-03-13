import {
  FileWithPreview,
  FileuploadProps,
} from "@/components/form/common/Fileupload";
import fileToDataUrl from "@/components/form/helper/fileToDataUrl";
import { imageSlice } from "@/lib/redux/slices/image";
import { useDispatch } from "@/lib/redux/store";
import { FC, useState } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { toast } from "sonner";

const useFileuploadDropzone = ({ field, options }: FileuploadProps) => {
  const dispatch = useDispatch();

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    ...options,
    noClick: true,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 100, // 100MB
    accept: {
      ...options?.accept,
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
      "image/webp": [".webp"],
    },
    onDrop: (acceptFiles) => {
      field.onChange(acceptFiles[0]);

      const files = acceptFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        }) as FileWithPreview;
      });

      dispatch(imageSlice.actions.setFiles(files));

      Promise.all(acceptFiles.map((file) => fileToDataUrl(file)))
        .then((dataUrls) => {
          dispatch(
            imageSlice.actions.setReferenceImages(
              dataUrls.map((dataUrl) => dataUrl as string)
            )
          );
        })
        .catch((err: any) => {
          console.error("Error converting file to data URL.", err.message);
        });
    },
    onDropRejected: (rejectedFiles) => {
      console.error(rejectedFiles);
      const error = rejectedFiles[0].errors[0];

      toast.error(error.code, {
        description: error.message,
      });
    },
  });

  return {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
  };
};

export default useFileuploadDropzone;
