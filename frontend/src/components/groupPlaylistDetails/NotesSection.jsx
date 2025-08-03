import RichTextEditor from "@/components/common/RichTextEditor";
import { useState } from "react";


const NotesSection = () => {
  const [text, setText] = useState
  ("Lore asdnsadjsandsnd sdasdsaj dsjd asj");
  return (
    <div className="bg-blue-600    flex-1 relative p-4">
      <RichTextEditor value={text} onChange={setText} />
    </div>
  );
};

export default NotesSection;
