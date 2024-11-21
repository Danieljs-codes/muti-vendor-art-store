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
	MoneyReceived: (props: ComponentProps<"svg">) => (
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
				d="M18 5.44232C18 5.44232 20 4.43881 21.241 5.45484C21.443 5.6182 21.6952 5.94158 21.8059 6.1793C22 6.59611 22 7.0003 22 7.80867V18.8176C22 19.8241 20.96 20.5154 20 20.2907C19.0803 20.0754 18.0659 19.9561 17 19.9561C15.0829 19.9561 13.3325 20.342 12 20.9781C10.6675 21.6141 8.91707 22.0001 7 22.0001C5.93408 22.0001 4.91969 21.8808 4 21.6655C3.4088 21.5271 3.11319 21.4579 2.75898 21.1715C2.55696 21.0081 2.30483 20.6847 2.19412 20.447C2 20.0302 2 19.626 2 18.8176V7.80867C2 6.80219 3.04003 6.1109 4 6.33561C4.77473 6.51696 5.61667 6.63021 6.5 6.6614"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M14.5 13.5C14.5 14.8807 13.3807 16 12 16C10.6193 16 9.5 14.8807 9.5 13.5C9.5 12.1193 10.6193 11 12 11C13.3807 11 14.5 12.1193 14.5 13.5Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M5.5 14.5L5.5 14.509"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M18.5 12.4922L18.5 12.5012"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M9.5 5.5C9.99153 6.0057 11.2998 8 12 8M14.5 5.5C14.0085 6.0057 12.7002 8 12 8M12 8V2"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	Increase: (props: ComponentProps<"svg">) => (
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
				d="M20 13V8H15"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M20 8L15 13C14.1174 13.8826 13.6762 14.3238 13.1346 14.3726C13.045 14.3807 12.955 14.3807 12.8654 14.3726C12.3238 14.3238 11.8826 13.8826 11 13C10.1174 12.1174 9.67615 11.6762 9.13457 11.6274C9.04504 11.6193 8.95496 11.6193 8.86543 11.6274C8.32385 11.6762 7.88256 12.1174 7 13L4 16"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	ArtworkUpload: (props: ComponentProps<"svg">) => (
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
				d="M5 21C9.20998 16.2487 13.9412 9.9475 21 14.6734"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M17 4.50012C17.4915 3.99442 18.7998 2.00012 19.5 2.00012M22 4.50012C21.5085 3.99442 20.2002 2.00012 19.5 2.00012M19.5 2.00012V10.0001"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M20.9999 13C20.998 17.147 20.9472 19.2703 19.6088 20.6088C18.2175 22 15.9783 22 11.5 22C7.02166 22 4.78249 22 3.39124 20.6088C2 19.2175 2 16.9783 2 12.5C2 8.02166 2 5.78249 3.39124 4.39124C4.78249 3 7.02166 3 11.5 3C11.6699 3 14 3.00008 14 3.00008"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	),
	PackageDelivered: (props: ComponentProps<"svg">) => (
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
				d="M21 7V12M3 7C3 10.0645 3 16.7742 3 17.1613C3 18.5438 4.94564 19.3657 8.83693 21.0095C10.4002 21.6698 11.1818 22 12 22L12 11.3548"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M15 19C15 19 15.875 19 16.75 21C16.75 21 19.5294 16 22 15"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6 12L8 13"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M17 4L7 9"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	ShippingTruck: (props: ComponentProps<"svg">) => (
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
				d="M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M9.5 17.5C9.5 18.8807 8.38071 20 7 20C5.61929 20 4.5 18.8807 4.5 17.5C4.5 16.1193 5.61929 15 7 15C8.38071 15 9.5 16.1193 9.5 17.5Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M14.5 17.5H9.5M19.5 17.5H20.2632C20.4831 17.5 20.5931 17.5 20.6855 17.4885C21.3669 17.4036 21.9036 16.8669 21.9885 16.1855C22 16.0931 22 15.9831 22 15.7632V13C22 9.41015 19.0899 6.5 15.5 6.5M15 15.5V7C15 5.58579 15 4.87868 14.5607 4.43934C14.1213 4 13.4142 4 12 4H5C3.58579 4 2.87868 4 2.43934 4.43934C2 4.87868 2 5.58579 2 7V15C2 15.9346 2 16.4019 2.20096 16.75C2.33261 16.978 2.52197 17.1674 2.75 17.299C3.09808 17.5 3.56538 17.5 4.5 17.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
};
