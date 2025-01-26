import React from "react";

const FileUpload = ({ handleFileUpload }) => (
  <div>
    <input type="file" accept="image/*" onChange={handleFileUpload} />
  </div>
);

export default FileUpload;
