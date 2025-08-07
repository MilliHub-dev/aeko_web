"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useReducer, useState } from "react";

type DialogState = { isSearchOpen: boolean };
type DialogAction = { type: "TOGGLE_SEARCH" } | { type: "CLOSE_ALL" };

const dialogReducer = (state: DialogState, action: DialogAction): DialogState => {
	switch (action.type) {
		case "TOGGLE_SEARCH":
			return { isSearchOpen: !state.isSearchOpen };
		case "CLOSE_ALL":
			return { isSearchOpen: false };
		default:
			return state;
	}
};

// Custom hook - this is exportable and follows Rules of Hooks
const useSearchDialog = () => {
	const [dialogState, dispatch] = useReducer(dialogReducer, {
		isSearchOpen: false
	});

	const handleRouteClick = (name: string) => {
		if (name === "Search") dispatch({ type: "TOGGLE_SEARCH" });
		else dispatch({ type: "CLOSE_ALL" });
	};

	const handleBackdropClick = () => {
		dispatch({ type: "CLOSE_ALL" });
	};

	const toggleSearch = () => {
		dispatch({ type: "TOGGLE_SEARCH" });
	};

	const closeDialog = () => {
		dispatch({ type: "CLOSE_ALL" });
	};

	return {
		dialogState,
		handleRouteClick,
		handleBackdropClick,
		toggleSearch,
		closeDialog
	};
};

interface SearchPanelProps {
	isOpen: boolean;
	onClose: () => void;
}

const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
	const [query, setQuery] = useState("");

	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={onClose}
		>
			<Dialog.Portal>
				<Dialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-200" />
				<Dialog.Popup className="fixed right-0 top-0 h-screen w-[400px] max-w-[calc(100vw-2rem)] bg-background/95 backdrop-blur-sm border-l border-border shadow-xl transition-transform duration-200 z-90">
					<div className="flex h-full flex-col p-4">
						<div className="flex items-center justify-between mb-4">
							<Dialog.Title className="text-foreground font-semibold text-lg">
								Search
							</Dialog.Title>
							<Dialog.Close className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
								<X className="w-5 h-5" />
							</Dialog.Close>
						</div>

						{/* Search Input */}
						<div className="relative mb-6">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
								<Search className="w-4 h-4" />
							</div>
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search anything..."
								className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								autoFocus
							/>
						</div>

						{/* Search Results */}
						<div className="flex-1 overflow-y-auto">
							{query ? (
								<div className="space-y-2">
									{/* Add your search results here */}
									<p className="text-sm text-muted-foreground">
										No results found for "{query}"
									</p>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center h-full text-center space-y-2">
									<Search className="w-12 h-12 text-muted-foreground/50" />
									<p className="text-sm text-muted-foreground">
										Start typing to search...
									</p>
								</div>
							)}
						</div>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

// Update the usage in your app:
const ParentComponent = () => {
	const { dialogState, toggleSearch, closeDialog } = useSearchDialog();

	return (
		<>
			<button onClick={toggleSearch}>Open Search</button>
			<SearchPanel
				isOpen={dialogState.isSearchOpen}
				onClose={closeDialog}
			/>
		</>
	);
};

export { SearchPanel, useSearchDialog };