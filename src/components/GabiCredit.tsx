function WhatsAppIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.464 3.484 1.345 4.997L2 22l5.146-1.35a9.96 9.96 0 0 0 4.858 1.237h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.929-7.068a9.935 9.935 0 0 0-7.072-2.929zm5.847 15.844a8.264 8.264 0 0 1-5.85 2.424h-.003a8.28 8.28 0 0 1-4.223-1.156l-.303-.18-3.055.801.815-2.978-.197-.306a8.27 8.27 0 0 1-1.269-4.42c0-4.57 3.719-8.288 8.29-8.288a8.24 8.24 0 0 1 5.86 2.43 8.24 8.24 0 0 1 2.425 5.86 8.264 8.264 0 0 1-2.49 5.813z" />
    </svg>
  );
}

export default function GabiCredit({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex w-full items-start gap-1.5 text-left text-[10px] text-muted sm:max-w-sm sm:text-xs ${className}`}
    >
      <WhatsAppIcon size={13} className="mt-0.5 shrink-0 text-[#25D366]" />
      <span className="min-w-0 leading-snug">
        Gabi: &ldquo;¿Y si elegir colegio para tus hijos fuera tan fácil como elegir dónde comer?
        Lo hice posible con{" "}
        <a
          href="https://santafe-schools.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark"
        >
          santafe-schools.vercel.app
        </a>{" "}
        🎓&rdquo;
      </span>
    </div>
  );
}
