import { FileWithPreview } from "@/components/form/common/Fileupload";
import { useState } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { toast } from "sonner";

const useFileuploadDropzone = ({ options }: { options?: DropzoneOptions }) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

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
      setFiles(
        acceptFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ) as FileWithPreview[]
      );
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
    files,
    setFiles,
  };
};

export default useFileuploadDropzone;
