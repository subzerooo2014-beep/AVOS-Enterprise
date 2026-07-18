type AvosLogoProps = {
  compact?: boolean;
};

export function AvosLogo({ compact = false }: AvosLogoProps) {
  return (
    <div className="flex items-center gap-3" aria-label="AVOS Enterprise">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#18324a] text-lg font-black text-[#d7bc83]">
        AV
      </div>
      {!compact && (
        <div>
          <div className="text-lg font-black tracking-[0.18em] text-[#18324a]">
            AVOS
          </div>
          <div className="text-xs font-semibold text-[#66717c]">
            Enterprise
          </div>
        </div>
      )}
    </div>
  );
}