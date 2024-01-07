import { useEffect, useRef, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

interface CopyProps {
  textToCopy: string;
}

export default function CopyAddress({ textToCopy }: CopyProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const copyToClipboard = () => {
    setCopySuccess(true);
    if (textAreaRef.current) {
      textAreaRef.current.select();
      document.execCommand("copy");
    }
  };

  useEffect(() => {
    if (copySuccess) {
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    }
  }, [copySuccess]);

  return (
    <div>
      <textarea
        ref={textAreaRef}
        value={textToCopy}
        style={{ position: "absolute", left: "-9999px" }}
        readOnly
      />
      <button onClick={copyToClipboard}>
        {copySuccess ? <FaCheck /> : <MdContentCopy />}
      </button>
    </div>
  );
}
