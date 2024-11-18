import type { ComponentProps } from "react";

export const Icons = {
	TimeSchedule: (props: ComponentProps<"svg">) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={20}
			height={20}
			fill={"none"}
			data-slot="icon"
			{...props}
		>
			<path
				d="M12 8V12L13.5 13.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M19.5454 16.4534C21.1818 17.337 22 17.7789 22 18.5C22 19.2211 21.1818 19.663 19.5454 20.5466L18.4311 21.1484C17.1744 21.827 16.5461 22.1663 16.2439 21.9196C15.504 21.3154 16.6567 19.7561 16.9403 19.2037C17.2277 18.644 17.2225 18.3459 16.9403 17.7963C16.6567 17.2439 15.504 15.6846 16.2439 15.0804C16.5461 14.8337 17.1744 15.173 18.4311 15.8516L19.5454 16.4534Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M13.0261 21.948C12.6888 21.9824 12.3464 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.6849 21.9311 13.3538 21.8 14"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	),
	Artwork: (props: ComponentProps<"svg">) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={20}
			height={20}
			fill={"none"}
			data-slot="icon"
			{...props}
		>
			<path
				d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.8417 22 14 22.1163 14 21C14 20.391 13.6832 19.9212 13.3686 19.4544C12.9082 18.7715 12.4523 18.0953 13 17C13.6667 15.6667 14.7778 15.6667 16.4815 15.6667C17.3334 15.6667 18.3334 15.6667 19.5 15.5C21.601 15.1999 22 13.9084 22 12Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M7 15.002L7.00868 14.9996"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
				cx="9.5"
				cy="8.5"
				r="1.5"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<circle
				cx="16.5"
				cy="9.5"
				r="1.5"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
		</svg>
	),
	Orders: (props: ComponentProps<"svg">) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={20}
			height={20}
			fill={"none"}
			data-slot="icon"
			{...props}
		>
			<path
				d="M14 22H9.62182C7.27396 22 6.10003 22 5.28565 21.2945C4.47127 20.5889 4.27181 19.3991 3.87289 17.0194L2.66933 9.83981C2.48735 8.75428 2.39637 8.21152 2.68773 7.85576C2.9791 7.5 3.51461 7.5 4.58564 7.5H19.4144C20.4854 7.5 21.0209 7.5 21.3123 7.85576C21.6036 8.21152 21.5126 8.75428 21.3307 9.83981L21.0524 11.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M17.5 7.5C17.5 4.46243 15.0376 2 12 2C8.96243 2 6.5 4.46243 6.5 7.5"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M16.5 19.5C16.9915 20.0057 18.2998 22 19 22M21.5 19.5C21.0085 20.0057 19.7002 22 19 22M19 22V14"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	Discount: (props: ComponentProps<"svg">) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={20}
			height={20}
			fill={"none"}
			data-slot="icon"
			{...props}
		>
			<path
				d="M7.72852 15.2861H12.7285M10.2271 12.7861H10.2364M10.2294 17.7861H10.2388"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.5 3.69682C9.53332 6.78172 14.5357 0.123719 17.4957 2.53998C19.1989 3.93028 18.6605 7 16.4494 9"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M18.664 6.57831C19.6473 6.75667 19.8679 7.34313 20.1615 8.97048C20.4259 10.4361 20.5 12.1949 20.5 12.9436C20.4731 13.2195 20.3532 13.477 20.1615 13.687C18.1054 15.722 14.0251 19.565 11.9657 21.474C11.1575 22.1555 9.93819 22.1702 9.08045 21.5447C7.32407 20.0526 5.63654 18.366 3.98343 16.8429C3.3193 16.035 3.33487 14.8866 4.0585 14.1255C6.23711 11.9909 10.1793 8.33731 12.4047 6.31887C12.6278 6.1383 12.9012 6.02536 13.1942 6C13.6935 5.99988 14.5501 6.06327 15.3845 6.10896"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	),
	Analytics: (props: ComponentProps<"svg">) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={20}
			height={20}
			fill={"none"}
			data-slot="icon"
			{...props}
		>
			<path
				d="M7 17L7 13"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M12 17L12 7"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M17 17L17 11"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
		</svg>
	),
};
