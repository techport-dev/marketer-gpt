import React, { type Dispatch, FC, type SetStateAction } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FileWithPreview } from ".";
import { useFormContext } from "react-hook-form";

type FilePreviewProps = {
  files: FileWithPreview[];
  setFiles: Dispatch<SetStateAction<FileWithPreview[]>>;
};

const FilePreview: FC<FilePreviewProps> = ({ files, setFiles }) => {
  const { resetField } = useFormContext();

  return (
    <div>
      <ul>
        {files.map((file) => (
          <li
            key={file.name}
            className="flex items-center justify-between mt-4 rounded"
          >
            <div className="flex items-center w-full gap-x-4">
              <div className="p-2 flex flex-wrap">
                <div className="group relative inline-block text-sm">
                  <div className="relative overflow-hidden rounded-xl border border-gray-200">
                    <div className="h-14 w-14">
                      <button type="button" className="h-full w-full">
                        <span
                          className="flex items-center h-full w-full justify-center bg-gray-500 bg-cover bg-center text-white"
                          style={{ backgroundImage: `url(${file.preview})` }}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <a
                  href={file.preview}
                  target="_blank"
                  className="text-xs text-blue-600 hover:text-blue-400 flex flex-col items-start gap-3 whitespace-normal break-all"
                >
                  <span className="break-all">{file.name}</span>
                </a>
              </div>

              <div>
                <TrashIcon
                  className="h-6 w-6 text-red-500 cursor-pointer"
                  onClick={() => {
                    setFiles([]);
                    resetField("images");
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilePreview;
