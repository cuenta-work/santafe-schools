export default function MushroomIcon({
  size = 12,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 6.5C0 3 2.7 0 6 0s6 3 6 6.5c0 1-.9 1.5-2 1.5H2c-1.1 0-2-.5-2-1.5Z"
        fill="currentColor"
      />
      <rect x="3.5" y="8" width="5" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}
