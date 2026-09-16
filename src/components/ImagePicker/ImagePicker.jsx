import { useEffect, useRef, useState } from "react";

const ImagePicker = ({ label, url, onFileChange, onRemove }) => {
  const [preview, setPreview] = useState("");
  const input = useRef(null);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const handleChange = (event) => {
    const selected = event.target.files[0] || null;
    setPreview(selected ? URL.createObjectURL(selected) : "");
    onFileChange(selected);
  };

  const handleRemove = () => {
    setPreview("");
    input.current.value = "";
    onFileChange(null);
    onRemove();
  };

  return (
    <div>
      <label>{label} <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} /></label>
      {(preview || url) && <p><img src={preview || url} alt={label} width="200" /></p>}
      {(preview || url) && <button type="button" onClick={handleRemove}>Remove image</button>}
    </div>
  );
};

export default ImagePicker;
