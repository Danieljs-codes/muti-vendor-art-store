import { type SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={48}
		height={48}
		viewBox="0 0 48 48"
		fill="none"
		data-slot="icon"
		{...props}
	>
		<path
			fill="#0063ff"
			fillRule="evenodd"
			d="M34 28h-6.343a4 4 0 0 0-2.829 1.172l-1.656 1.656A4 4 0 0 1 20.343 32H14a6 6 0 0 1 0-12h6.343a4 4 0 0 0 2.829-1.172l1.656-1.656A4 4 0 0 1 27.657 16H34a6 6 0 0 1 0 12Zm-6.343-8a4 4 0 0 0-2.829 1.172l-1.656 1.656A4 4 0 0 1 20.343 24H14a2 2 0 1 0 0 4h6.343a4 4 0 0 0 2.829-1.172l1.656-1.656A4 4 0 0 1 27.657 24H34a2 2 0 1 0 0-4h-6.343Z"
			clipRule="evenodd"
		/>
		<path
			fill="#0063ff"
			fillRule="evenodd"
			d="M34 36h-6.343a4 4 0 0 0-2.829 1.172l-1.656 1.656A4 4 0 0 1 20.343 40H14C6.268 40 0 33.732 0 26s6.268-14 14-14h6.343a4 4 0 0 0 2.829-1.172l1.656-1.656A4 4 0 0 1 27.657 8H34c7.732 0 14 6.268 14 14s-6.268 14-14 14Zm-6.343-24a4 4 0 0 0-2.829 1.172l-1.656 1.656A4 4 0 0 1 20.343 16H14C8.477 16 4 20.477 4 26s4.477 10 10 10h6.343a4 4 0 0 0 2.829-1.172l1.656-1.656A4 4 0 0 1 27.657 32H34c5.523 0 10-4.477 10-10s-4.477-10-10-10h-6.343Z"
			clipRule="evenodd"
		/>
	</svg>
);
const Memo = memo(SvgComponent);
export { Memo as LogoIcon };
