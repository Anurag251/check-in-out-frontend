import React, { useState } from "react";
import axios from "axios";

export const UploadExcel = () => {
  const [formValues, setFormValues] = useState({
    file: null,
  });

  const handleChange = (event) => {
    const { name, files } = event.target;

    setFormValues({ ...formValues, [name]: files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formValues.file) {
      try {
        const formData = new FormData();
        formData.append("file", formValues.file);

        await axios.post("http://localhost:3000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Data uploaded successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="file" onChange={handleChange} />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};
