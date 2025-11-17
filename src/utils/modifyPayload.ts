import { FieldValues } from "react-hook-form";

export const modifyPayload = (values: FieldValues) => {
  const obj = { ...values };
  const singleFile = obj["file"];       
  const multipleFiles = obj["images"];  
  delete obj["file"];
  delete obj["images"];

  const data = JSON.stringify(obj);
  const formData = new FormData();
  formData.append("data", data);

  if (singleFile) {
    formData.append("file", singleFile as Blob);
  }


  if (Array.isArray(multipleFiles)) {
    multipleFiles.forEach((file: Blob) => {
      formData.append("files", file);
    });
  }

  return formData;
};
