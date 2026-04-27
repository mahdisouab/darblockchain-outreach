import * as React from "react";

export const Card = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-bistro-charcoal/5 ${className}`}
    {...props}
  />
);

export const CardContent = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`} {...props} />
);
