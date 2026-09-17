import { useContext, useEffect, useRef, useState } from "react";
import { LanguageContext } from "../../contexts/LanguageContext.js";

const ImagePicker = ({ label, url, onFileChange, onRemove }) => {
  const { t } = useContext(LanguageContext);
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
    <div className="image-picker">
      <label className="field"><span className="field-label">{label}</span> <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} /></label>
      {(preview || url) && <p><img src={preview || url} alt={label} width="200" /></p>}
      {(preview || url) && <button type="button" className="btn-soft btn-sm" onClick={handleRemove}>{t("Remove image")}</button>}
    </div>
  );
};

export default ImagePicker;
