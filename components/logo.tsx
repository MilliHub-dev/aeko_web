import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoProps {
  size?: number;
}

const Logo = ({size = 50}: LogoProps) => {
  const { theme } = useTheme();
  return (
    <div className="flex justify-start lg:pl-2">
      <Image
        src="/aeko.svg"
        alt="aeko logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
};


export { Logo };
