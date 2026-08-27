export default function SchoolMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect width="64" height="64" rx="18" fill="var(--primary)" />
      <path d="M32 16 L54 25 L32 34 L10 25 Z" fill="var(--card)" />
      <path
        d="M20 28.5 V39 c0 3 5.5 5.5 12 5.5 s12 -2.5 12 -5.5 v-10.5"
        stroke="var(--card)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M54 25 V37" stroke="var(--gold)" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="54" cy="40.5" r="2.6" fill="var(--gold)" />
    </svg>
  );
}
