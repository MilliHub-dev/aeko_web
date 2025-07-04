import Image from "next/image";

export default function ProfileCard({
  isDialogOpen,
}: {
  isDialogOpen: boolean;
}) {
  return (
    <div
      className={`w-full mx-auto rounded-2xl text-center border border-border/50 transition-all duration-300 ${
        isDialogOpen ? "w-16 h-16 p-2 rounded-full" : "max-w-[250px] p-6"
      }`}
    >
      {/* Avatar with gradient border */}
      <div
        className={`relative mx-auto ${
          isDialogOpen ? "w-12 h-12 mb-0" : "w-15 h-15 mb-4"
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-0.5">
          <div className="w-full h-full rounded-full bg-background p-1">
            <Image
              src="/placeholder.svg"
              alt="Profile Avatar"
              width={64}
              height={64}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* User Info - Hidden when dialog is open */}
      {!isDialogOpen && (
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground">
              Alexis Wells
            </h3>
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">@wellsalex</p>
        </div>
      )}

      {/* Stats - Hidden when dialog is open */}
      {!isDialogOpen && (
        <div className="flex justify-between text-center">
          <div className="flex-1">
            <div className="text-lg font-semibold text-foreground">4.6k</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold text-foreground">4.6k</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold text-foreground">4.6k</div>
            <div className="text-xs text-muted-foreground">Event</div>
          </div>
        </div>
      )}
    </div>
  );
}
