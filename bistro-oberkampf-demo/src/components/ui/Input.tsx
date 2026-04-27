import * as React from "react";

const inputBase =
  "w-full h-11 px-4 rounded-lg border border-bistro-charcoal/15 bg-white font-inter text-sm text-bistro-charcoal placeholder:text-bistro-graphite/60 focus:outline-none focus:border-bistro-forest focus:ring-2 focus:ring-bistro-forest/20 transition";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`${inputBase} ${className}`} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`${inputBase} h-auto py-3 min-h-[100px] resize-none ${className}`}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", children, ...props }, ref) => (
  <select
    ref={ref}
    className={`${inputBase} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%20fill=%22%234a4a4a%22%3E%3Cpath%20d=%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem] pr-10 ${className}`}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const Label = ({
  className = "",
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={`block text-xs font-inter font-medium uppercase tracking-wider text-bistro-graphite mb-1.5 ${className}`}
    {...props}
  />
);
