import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/2 transition-colors"
      >
        <span className="text-sm font-semibold text-white/80">{title}</span>
        {open ? (
          <ChevronUp size={16} className="text-white/30" />
        ) : (
          <ChevronDown size={16} className="text-white/30" />
        )}
      </button>
      {open && <div className="px-6 pb-6 flex flex-col gap-4">{children}</div>}
    </div>
  );
}

export default Section;
