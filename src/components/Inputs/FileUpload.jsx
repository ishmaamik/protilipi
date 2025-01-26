import React from "react";

const FileUpload = ({ handleFileUpload }) => (
  <div>
    <input
      type="file"
      accept="application/pdf,image/*" // Accepts both PDF and image files
      onChange={handleFileUpload}
    />
  </div>
);

export default FileUpload;
