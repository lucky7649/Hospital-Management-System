import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { AiOutlineCloudDownload } from "react-icons/ai";

const DragDropFileUpload = ({
  onFileUpload,
  height = "80vh",
  width = "24rem",
  defaultImage, // Accept default image as prop
}) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(defaultImage || null); // Initialize with defaultImage

  // Update previewUrl when defaultImage changes
  useEffect(() => {
    if (defaultImage) {
      setPreviewUrl(defaultImage);
    }
  }, [defaultImage]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setSelectedFile(file);

      // Generate preview URL for the selected image
      const filePreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(filePreviewUrl);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post("http://localhost:1000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
     

        if (res.data.filePath) {
          onFileUpload(res.data.filePath);
        }
      } catch (err) {
        console.error("Upload error", err);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{ width, height }}
      className="border-2 border-dashed rounded-xl border-gray-300 dark:border-gray-500 flex justify-center items-center cursor-pointer  hover:bg-gray-100 transition p-4"
    >
      <input {...getInputProps()} />
      {previewUrl ? (
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={
              previewUrl.startsWith("blob") || previewUrl.startsWith("http")
                ? previewUrl // If it's a local blob or a full URL, use it
                : `${apiUrl}/uploads/${previewUrl}` // Otherwise, prepend the base URL
            }
            alt="Preview"
            className="object-contain w-full h-full"
            onError={() => setPreviewUrl(null)} // Handle broken images
          />
        </div>
      ) : isDragActive ? (
        <p className="text-gray-600 dark:text-gray-400">
          Drop the file here...
        </p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 flex flex-col items-center">
          <AiOutlineCloudDownload size={80} />
          Drag & drop{" "}
          <span>
            or <span className="gradient-text"> Browse</span>
          </span>
        </p>
      )}
    </div>
  );
};

export default DragDropFileUpload;
