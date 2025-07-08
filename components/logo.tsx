import { useTheme } from "next-themes";
import Image from "next/image";

const Logo = () => {
  const { theme } = useTheme();
  return (
    <div className="flex justify-center">
      <Image
        src={theme === "dark" ? "/aeko-dark.png" : "/aeko-light.png"}
        alt="aeko logo"
        width={50}
        height={50}
        className="object-contain"
        priority
      />
    </div>
  );
};

export { Logo };
