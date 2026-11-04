interface CurvedWaveDividerProps {
  fillColor?: string;
  className?: string;
  heightClassName?: string;
  flip?: boolean;
}

export default function CurvedWaveDivider({
  fillColor = "#F8F9FA",
  className = "",
  heightClassName = "h-12 md:h-20 lg:h-24",
  flip = false,
}: CurvedWaveDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${className} ${
        flip ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full block ${heightClassName}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C320,100 680,120 1020,70 C1200,45 1340,15 1440,0 L1440,135 L0,135 Z"
          fill={fillColor}
        />
      </svg>
      {/* Phủ kín mép đáy triệt tiêu hoàn toàn đường kẻ 1px sub-pixel */}
      {!flip && (
        <div
          style={{ backgroundColor: fillColor, height: "4px", marginTop: "-2px" }}
          className="w-full relative z-10"
        />
      )}
    </div>
  );
}
