"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import type { FocusEventHandler } from "react";

interface ExploreSearchBarProps {
	value: string;
	onChange: (value: string) => void;
	onFocus?: FocusEventHandler<HTMLInputElement>;
	onClear: () => void;
	showCancel?: boolean;
	className?: string;
}

export function ExploreSearchBar({
	value,
	onChange,
	onFocus,
	onClear,
	showCancel,
	className
}: ExploreSearchBarProps) {
	return (
		<div className={cn("flex items-center gap-4", className)}>
			<div className="relative flex-1">
				<span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
					<Search className="h-5 w-5" />
				</span>
				<Input
					type="search"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					onFocus={onFocus}
					placeholder="Search for anything"
					className="h-14 rounded-full border border-border/50 bg-muted/40 pl-14 pr-16 text-base shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
				/>
				{value && (
					<button
						type="button"
						onClick={onClear}
						className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
					>
						<X className="h-5 w-5" />
					</button>
				)}
			</div>
			{showCancel && (
				<button
					type="button"
					onClick={onClear}
					className="text-sm font-semibold text-secondary transition hover:text-secondary/80"
				>
					Cancel
				</button>
			)}
		</div>
	);
}
