import svgPaths from "./svg-ws0ldnzu3i";

function Group() {
  return (
    <div className="absolute inset-[38.49%_9.5%_38.3%_9.77%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 293.872 84.4723">
        <g id="Group 38">
          <path d={svgPaths.p14949a00} fill="url(#paint0_linear_7_25)" id="Union" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_7_25" x1="-0.000336313" x2="293.872" y1="42.2361" y2="42.2361">
            <stop stopColor="#00F65C" />
            <stop offset="0.447115" stopColor="#C1FB00" />
            <stop offset="1" stopColor="#F57BFF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Logo() {
  return (
    <div className="bg-[#292929] relative size-full" data-name="LOGO">
      <div className="absolute inset-0 rounded-[10px]" />
      <Group />
    </div>
  );
}