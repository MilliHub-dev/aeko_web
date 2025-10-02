import { BaseLayout } from "@/components/shared/base-layout";

export default function AekoMainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="no-gutter">
			<BaseLayout>{children}</BaseLayout>;
		</div>
	);
}

