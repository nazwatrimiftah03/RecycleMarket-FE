import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      data-slot="textarea"
      className={cn(
        "flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm placeholder:text-muted-foreground bg-input-background border-input outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
