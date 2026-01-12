import svgPaths from "./svg-f8m7zfw7v9";
import clsx from "clsx";

function NutritionHelper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute left-[calc(50%+2.5px)] size-[116px] top-[230px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 116 116">
        {children}
      </svg>
    </div>
  );
}

function NutritionHelper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute left-[calc(41.67%-0.75px)] size-[188px] top-[194px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 188 188">
        {children}
      </svg>
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("absolute size-[20px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        {children}
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute h-[25.116px] left-[calc(41.67%-9.75px)] top-[70px] w-[83.317px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.3174 25.1163">
        <g id="Group 35">
          <path d={svgPaths.p1eecd870} fill="url(#paint0_linear_7_137)" id="Line 23 (Stroke)" />
          <path d={svgPaths.p2c50e100} fill="url(#paint1_linear_7_137)" id="Line 29 (Stroke)" />
          <path d={svgPaths.p9e0d2b0} fill="url(#paint2_linear_7_137)" id="Line 30 (Stroke)" />
          <path d={svgPaths.p2a15c070} fill="url(#paint3_linear_7_137)" id="Line 25 (Stroke)" />
          <path d={svgPaths.p28351500} fill="url(#paint4_linear_7_137)" id="Line 28 (Stroke)" />
          <path d={svgPaths.pb988880} fill="url(#paint5_linear_7_137)" id="Line 26 (Stroke)" />
          <path d={svgPaths.p32d9cd80} fill="url(#paint6_linear_7_137)" id="Line 27 (Stroke)" />
          <path d={svgPaths.p33dcee00} fill="url(#paint7_linear_7_137)" id="Line 24 (Stroke)" />
          <path d={svgPaths.pe39a080} fill="url(#paint8_linear_7_137)" id="Ellipse 4 (Stroke)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_7_137" x1="41.1052" x2="41.1052" y1="25.751" y2="0.225627">
            <stop stopColor="#51677F" />
            <stop offset="1" stopColor="#F7613F" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_7_137" x1="6.99977" x2="6.99977" y1="14.752" y2="2.21216">
            <stop stopColor="#51677F" />
            <stop offset="1" stopColor="#F7613F" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_7_137" x1="9.09021" x2="9.09021" y1="13.4289" y2="23.97">
            <stop stopColor="#51677F" />
            <stop offset="1" stopColor="#F7613F" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_7_137" x1="62.0694" x2="62.0694" y1="25.751" y2="0.225627">
            <stop stopColor="#51677F" />
            <stop offset="1" stopColor="#F7613F" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint4_linear_7_137" x1="62.2938" x2="81.867" y1="18.1006" y2="18.1006">
            <stop stopColor="#51677F" />
            <stop offset="1" stopColor="#F7613F" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint5_linear_7_137" x1="63.4729" x2="75.5255" y1="26.4175" y2="1.2231">
            <stop stopColor="#51677F" />
            <stop offset="1" stopColor="#F7613F" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint6_linear_7_137" x1="70.984" x2="81.7223" y1="-0.385896" y2="24.8669">
            <stop stopColor="#51677F" />
            <stop offset="1" stopColor="#F7613F" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint7_linear_7_137" x1="61.7299" x2="39.6311" y1="6.58462" y2="6.58462">
            <stop stopColor="#51677F" />
            <stop offset="1" stopColor="#F7613F" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint8_linear_7_137" x1="13.2484" x2="38.5042" y1="11.1904" y2="11.1904">
            <stop stopColor="#51677F" />
            <stop offset="1" stopColor="#F7613F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function ChevronRight() {
  return (
    <Wrapper additionalClassNames="left-[calc(83.33%+19.5px)] top-[409px]">
      <g id="Chevron right">
        <path d="M7.5 15L12.5 10L7.5 5" id="Icon" stroke="var(--stroke-0, #F7613F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </g>
    </Wrapper>
  );
}

function Plus() {
  return (
    <Wrapper additionalClassNames="left-[calc(75%+10.25px)] top-[589px]">
      <g id="Plus">
        <path d={svgPaths.p17eb400} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      </g>
    </Wrapper>
  );
}

export default function Nutrition() {
  return (
    <div className="bg-white border border-black border-solid relative size-full" data-name="Nutrition">
      <Group />
      <div className="absolute bg-white h-[318px] left-[calc(8.33%-19.75px)] rounded-[9px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] top-[129px] w-[365px]" />
      <p className="absolute font-['Afacad:Bold',sans-serif] font-bold leading-[normal] left-[calc(8.33%+4.25px)] text-[20px] text-black text-nowrap top-[198px]">67/75g</p>
      <p className="absolute font-['Afacad:Bold',sans-serif] font-bold leading-[normal] left-[calc(8.33%+4.25px)] text-[20px] text-black text-nowrap top-[246px]">95/113g</p>
      <p className="absolute font-['Afacad:Bold',sans-serif] font-bold leading-[normal] left-[calc(8.33%+4.25px)] text-[20px] text-black text-nowrap top-[301px]">26/56g</p>
      <ChevronRight />
      <p className="absolute font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[normal] left-[calc(8.33%+7.25px)] text-[20px] text-black text-nowrap top-[139px]">Objectif du jour</p>
      <div className="absolute left-[calc(50%+19.5px)] size-[81px] top-[247px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 81 81">
          <circle cx="40.5" cy="40.5" fill="var(--fill-0, white)" id="Ellipse 9" r="40.5" />
        </svg>
      </div>
      <NutritionHelper>
        <g id="Ellipse 13">
          <mask fill="white" id="path-1-inside-1_7_237">
            <path d={svgPaths.p1fd90a00} />
          </mask>
          <path d={svgPaths.p1fd90a00} mask="url(#path-1-inside-1_7_237)" stroke="var(--stroke-0, black)" />
        </g>
      </NutritionHelper>
      <NutritionHelper1>
        <g id="Ellipse 12">
          <mask fill="white" id="path-1-inside-1_7_148">
            <path d={svgPaths.p3d0f5a80} />
          </mask>
          <path d={svgPaths.p3d0f5a80} mask="url(#path-1-inside-1_7_148)" stroke="var(--stroke-0, black)" />
        </g>
      </NutritionHelper1>
      <NutritionHelper1>
        <g id="Ellipse 8">
          <mask fill="white" id="path-1-inside-1_7_135">
            <path d={svgPaths.p1643b580} />
          </mask>
          <path d={svgPaths.p1643b580} mask="url(#path-1-inside-1_7_135)" stroke="var(--stroke-0, #FB8E76)" strokeWidth="34" />
        </g>
      </NutritionHelper1>
      <div className="absolute left-[calc(41.67%+17.25px)] size-[152px] top-[212px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 152 152">
          <g id="Ellipse 11">
            <mask fill="white" id="path-1-inside-1_7_154">
              <path d={svgPaths.p229185e0} />
            </mask>
            <path d={svgPaths.p229185e0} mask="url(#path-1-inside-1_7_154)" stroke="var(--stroke-0, black)" />
          </g>
        </svg>
      </div>
      <NutritionHelper>
        <g id="Ellipse 6">
          <mask fill="white" id="path-1-inside-1_7_159">
            <path d={svgPaths.p832b500} />
          </mask>
          <path d={svgPaths.p832b500} mask="url(#path-1-inside-1_7_159)" stroke="var(--stroke-0, #F7613F)" strokeWidth="34" />
        </g>
      </NutritionHelper>
      <div className="absolute left-[calc(41.67%+17.25px)] size-[152px] top-[212px]">
        <div className="absolute inset-[0_0_0_14.64%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 129.74 152">
            <g id="Ellipse 7">
              <mask fill="white" id="path-1-inside-1_7_133">
                <path d={svgPaths.p17ff4300} />
              </mask>
              <path d={svgPaths.p17ff4300} mask="url(#path-1-inside-1_7_133)" stroke="var(--stroke-0, #FFA591)" strokeWidth="34" />
            </g>
          </svg>
        </div>
      </div>
      <div className="absolute bg-[#f7613f] h-[27px] left-[calc(8.33%+11.25px)] rounded-[10px] top-[402px] w-[87px]" />
      <div className="absolute bg-[#f7613f] h-[27px] left-[calc(8.33%-11.75px)] rounded-[10px] top-[478px] w-[87px]" />
      <div className="absolute bg-[#ffa591] h-[27px] left-[calc(33.33%+3px)] rounded-[10px] top-[402px] w-[87px]" />
      <div className="absolute bg-[#f6f3f3] h-[27px] left-[calc(25%+12.75px)] rounded-[10px] top-[478px] w-[87px]" />
      <div className="absolute bg-[#fb8e76] h-[27px] left-[calc(58.33%-5.25px)] rounded-[10px] top-[402px] w-[87px]" />
      <div className="absolute bg-[#f6f3f3] h-[27px] left-[calc(50%+4.5px)] rounded-[10px] top-[478px] w-[87px]" />
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(16.67%-4.5px)] text-[16px] text-nowrap text-white top-[405px]">Glucides</p>
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(8.33%+5.25px)] text-[16px] text-nowrap text-white top-[481px]">Glucides</p>
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(41.67%-5.75px)] text-[16px] text-nowrap text-white top-[405px]">Lipides</p>
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(33.33%+4px)] text-[16px] text-black text-nowrap top-[481px]">Lipides</p>
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(58.33%+8.75px)] text-[16px] text-nowrap text-white top-[405px]">Proteines</p>
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(50%+18.5px)] text-[16px] text-black text-nowrap top-[481px]">Proteines</p>
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(8.33%-11.75px)] text-[24px] text-black text-nowrap top-[575px]">Riz blanc cuit</p>
      <p className="absolute font-['Afacad:Italic',sans-serif] font-normal italic leading-[normal] left-[calc(8.33%-6.75px)] text-[#b5b5b5] text-[14px] text-nowrap top-[536px]">Pour 100g</p>
      <p className="absolute font-['Afacad:SemiBold',sans-serif] font-semibold leading-[normal] left-[calc(8.33%-11.75px)] text-[#b5b5b5] text-[14px] text-nowrap top-[607px]">{`Protéines: 2,5g  Glucides: 28g  Lipides: 0,3g`}</p>
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(8.33%+6.25px)] text-[#fb8e76] text-[15px] text-nowrap top-[220px]">{`Protéines `}</p>
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(8.33%+5.25px)] text-[#f7613f] text-[15px] text-nowrap top-[273px]">Glucides</p>
      <p className="absolute font-['Afacad:Medium',sans-serif] font-medium leading-[normal] left-[calc(8.33%+5.25px)] text-[#ffa591] text-[15px] text-nowrap top-[321px]">Lipides</p>
      <div className="absolute bg-[#f5f5f5] left-[calc(83.33%+9.5px)] rounded-[5px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[27px] top-[585px]" />
      <div className="absolute bg-[#f5f5f5] left-[calc(75%+6.25px)] rounded-[5px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[27px] top-[585px]" />
      <Plus />
    </div>
  );
}