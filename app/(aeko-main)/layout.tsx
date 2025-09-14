import { BaseLayout } from "@/components/shared/base-layout";

export default function AekoMainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <BaseLayout>{children}</BaseLayout>;
}

