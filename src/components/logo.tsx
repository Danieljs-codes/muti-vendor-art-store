import { LogoIcon } from "@/components/logo-icon";
import { cn } from "@/utils/classes";
import type { ComponentPropsWithoutRef } from "react";

interface LogoProps
	extends Omit<ComponentPropsWithoutRef<typeof LogoIcon>, "className"> {
	classNames?: Partial<Record<"container" | "icon" | "text", string>>;
	iconOnly?: boolean;
}

export const Logo = ({ classNames, iconOnly = false, ...props }: LogoProps) => {
	if (iconOnly) {
		return (
			<LogoIcon className={cn("h-10 w-10", classNames?.icon)} {...props} />
		);
	}

	return (
		<div className={cn("flex items-center gap-2", classNames?.container)}>
			<LogoIcon className={cn("h-10 w-10", classNames?.icon)} {...props} />
			<span className={cn("text-xl font-bold", classNames?.text)}>
				BoltShift
			</span>
		</div>
	);
};
