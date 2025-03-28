
import React, { useRef } from "react";

interface ImportFileInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const ImportFileInput = ({ onChange, inputRef }: ImportFileInputProps) => {
  const defaultRef = useRef<HTMLInputElement>(null);
  const fileRef = inputRef || defaultRef;
  
  return (
    <input
      type="file"
      ref={fileRef}
      onChange={onChange}
      accept=".json"
      className="hidden"
    />
  );
};

export default ImportFileInput;
