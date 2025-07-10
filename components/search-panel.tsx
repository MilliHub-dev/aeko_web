"use client";

import { motion } from "motion/react";
import { useReducer } from "react";

type DialogState = { isSearchOpen: boolean };
type DialogAction = { type: "TOGGLE_SEARCH" } | { type: "CLOSE_ALL" };

const dialogReducer = (
  state: DialogState,
  action: DialogAction
): DialogState => {
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
export const useSearchDialog = () => {
  const [dialogState, dispatch] = useReducer(dialogReducer, {
    isSearchOpen: false,
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
    closeDialog,
  };
};

interface SearchPanelProps {
  onClose?: () => void;
}

const SearchPanel = ({ onClose }: SearchPanelProps) => {
  return (
    <motion.div
      id="search-dialog"
      className="h-screen fixed top-0 left-[max(64px,calc(50%-576px))] lg:left-[max(256px,calc(50%-384px))] border-r border-border bg-background/95 backdrop-blur-sm py-4 px-4 z-30 overflow-hidden shadow-xl"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "tween", duration: 0.25 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-semibold text-lg">Search</h2>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          autoFocus
        />
      </div>
      
      {/* Search Results Placeholder */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Start typing to search...</p>
      </div>
    </motion.div>
  );
};

export { SearchPanel };