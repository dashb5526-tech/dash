import type { SVGProps } from "react";

export function RiceBowl(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12.37A10 10 0 0 1 12 2a10 10 0 0 1 10 10.37" />
      <path d="M12 22a4.7 4.7 0 0 0 4.7-4.7H7.3A4.7 4.7 0 0 0 12 22Z" />
      <path d="M8 12h8" />
      <path d="m8 12 2 4" />
      <path d="m16 12-2 4" />
      <path d="M12 12V7" />
    </svg>
  );
}
