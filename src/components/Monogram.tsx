import { institutionColor, institutionInitials } from "@/lib/institutionColor";

export default function Monogram({
  id,
  name,
  size = 40,
}: {
  id: string;
  name: string;
  size?: number;
}) {
  const { bg, border } = institutionColor(id);
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl font-display font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: `0 3px 10px -2px ${bg}`,
      }}
      aria-hidden="true"
    >
      {institutionInitials(name)}
    </div>
  );
}
