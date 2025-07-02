export default function Header() {
  return (
    <header className="w-full max-w-[600px] px-3 py-3 bg-glass border-b border-border md:border-0 mx-auto">
      <div className="max-w-screen-md mx-auto overflow-x-scroll no-scrollbar snap-x snap-mandatory">
        <div className="flex gap-5 w-max px-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 snap-center">
              <div className="w-16 h-16 rounded-full border-2 border-primary bg-muted shrink-0" />
              <p className="text-xs text-muted-foreground truncate w-16 text-center">
                user_{i + 1}
              </p>
            </div>
          ))}  
        </div>
      </div>
    </header>
  );
}
