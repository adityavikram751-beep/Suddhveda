import React from "react";

type Props = {
  width?: number;
  height?: number;
  className?: string;
};

export default function Honeycomb({ width = 402, height = 392, className = "" }: Props) {
  const a = 40; // hex side
  const h = Math.round(Math.sqrt(3) * a * 100) / 100; // hex height
  const points = `${a * 0.5},0 ${a * 1.5},0 ${2 * a},${Math.round(h / 2 * 100) / 100} ${a * 1.5},${h} ${a * 0.5},${h} 0,${Math.round(h / 2 * 100) / 100}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="translate(10,10)" stroke="#E9C98D" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Column 0 */}
        <g>
          <polygon points={points} transform={`translate(0,0)`} />
          <polygon points={points} transform={`translate(0,${h + 6})`} />
          <polygon points={points} transform={`translate(0,${(h + 6) * 2})`} />
        </g>

        {/* Column 1 (offset) */}
        <g>
          <polygon points={points} transform={`translate(${a * 1.5 + 8},${(h + 6) / 2})`} />
          <polygon points={points} transform={`translate(${a * 1.5 + 8},${(h + 6) / 2 + (h + 6)})`} />
          <polygon points={points} transform={`translate(${a * 1.5 + 8},${(h + 6) / 2 + (h + 6) * 2})`} />
          <polygon points={points} transform={`translate(${a * 1.5 + 8},${(h + 6) / 2 - (h + 6)})`} />
        </g>

        {/* Column 2 */}
        <g>
          <polygon points={points} transform={`translate(${(a * 1.5 + 8) * 2},0)`} />
          <polygon points={points} transform={`translate(${(a * 1.5 + 8) * 2},${h + 6})`} />
          <polygon points={points} transform={`translate(${(a * 1.5 + 8) * 2},${(h + 6) * 2})`} />
        </g>

        {/* Small decorative extra hexes */}
        <g opacity={0.95}>
          <polygon points={points} transform={`translate(${(a * 1.5 + 8) * 3 - 24},${(h + 6) / 2})`} />
          <polygon points={points} transform={`translate(${(a * 1.5 + 8) * 3 - 24},${(h + 6) / 2 + (h + 6)})`} />
        </g>
      </g>
    </svg>
  );
}
