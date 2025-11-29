"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Interest } from "@/types/interest";
import { Button } from "@/components/ui/button";

export default function InterestsPage() {
  const router = useRouter();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch interests on mount
  useEffect(() => {
    async function fetchInterests() {
      try {
        const response = await fetch("/api/interests");
        const data = await response.json();

        if (data.success && data.data) {
          setInterests(
            data.data.filter((interest: Interest) => interest.isActive)
          );
        } else {
          setError("Failed to load interests");
        }
      } catch (err) {
        console.error("Error fetching interests:", err);
        setError("Failed to load interests");
      } finally {
        setLoading(false);
      }
    }

    fetchInterests();
  }, []);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interestId)) {
        newSet.delete(interestId);
      } else {
        newSet.add(interestId);
      }
      return newSet;
    });
  };

  const handleContinue = async () => {
    if (selectedInterests.size === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interestIds: Array.from(selectedInterests),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        router.push("/home");
      } else {
        setError(data.error || "Failed to save interests");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Error saving interests:", err);
      setError("Failed to save interests");
      setSubmitting(false);
    }
  };

  // Color variants for interest pills matching the design
  const colorVariants = [
    "bg-[#5B7FE8] hover:bg-[#4B6FD8]", // Blue (Fitness)
    "bg-transparent border-2 border-secondary hover:bg-secondary/10", // Outlined (Gaming)
    "bg-transparent border-2 border-secondary hover:bg-secondary/10", // Outlined (Travels)
    "bg-[#FF9B7A] hover:bg-[#FF8B6A]", // Orange (Food)
    "bg-transparent border-2 border-secondary hover:bg-secondary/10", // Outlined (Photography)
    "bg-transparent border-2 border-secondary hover:bg-secondary/10", // Outlined (Education)
    "bg-[#E85B9F] hover:bg-[#D84B8F]", // Pink (Fashion)
    "bg-transparent border-2 border-secondary hover:bg-secondary/10", // Outlined (Finance)
    "bg-transparent border-2 border-secondary hover:bg-secondary/10", // Outlined (Music)
    "bg-transparent border-2 border-secondary hover:bg-secondary/10", // Outlined (Health)
    "bg-[#F5C842] hover:bg-[#E5B832]", // Yellow (Job)
    "bg-[#1A1A1A] hover:bg-[#2A2A2A]", // Dark (Motivation)
    "bg-transparent border-2 border-secondary hover:bg-secondary/10", // Outlined (Technology)
    "bg-transparent border-2 border-secondary hover:bg-secondary/10", // Outlined (News)
    "bg-[#42F5E8] hover:bg-[#32E5D8]", // Cyan (Web3)
  ];

  const getVariant = (index: number, isSelected: boolean) => {
    if (isSelected) {
      // When selected, use filled colors
      return colorVariants[index % colorVariants.length];
    }
    // When not selected, always use outlined style
    return "bg-transparent border-2 border-secondary hover:bg-secondary/10";
  };

  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,#007F6D,#003B33)] flex items-center justify-center">
        <div className="text-secondary text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,#007F6D,#003B33)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_0%,transparent,rgba(0,0,0,0.04))]" />

      <div className="relative mx-auto max-w-2xl px-6 py-8 sm:py-12">
        {/* Progress indicator */}
        <div className="flex gap-2 mb-8 sm:mb-12 justify-center">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === 1 ? "bg-secondary w-12" : "bg-secondary/30 w-8"
              }`}
            />
          ))}
        </div>

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-3">
            Choose your vibe
          </h1>
          <p className="text-secondary/80 text-base sm:text-lg">
            Aeko is here to give you an amazing experience!
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-100 text-sm">
            {error}
          </div>
        )}

        {/* Interests grid */}
        <div className="flex flex-wrap gap-3 mb-8 sm:mb-12 justify-center">
          {interests.map((interest, index) => {
            const isSelected = selectedInterests.has(interest._id);
            return (
              <button
                key={interest._id}
                onClick={() => toggleInterest(interest._id)}
                className={`px-6 py-3 rounded-full text-secondary font-medium transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${getVariant(
                  index,
                  isSelected
                )} ${isSelected ? "shadow-lg" : ""}`}>
                {interest.icon && <span>{interest.icon}</span>}
                <span>{interest.displayName}</span>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={selectedInterests.size === 0 || submitting}
            className="w-full max-w-md btn-glass rounded-xl h-14 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? "Saving..." : "Continue"}
          </Button>
        </div>

        {/* Helper text */}
        {selectedInterests.size === 0 && (
          <p className="text-center text-secondary/60 text-sm mt-4">
            Select at least one interest to continue
          </p>
        )}
      </div>
    </main>
  );
}
