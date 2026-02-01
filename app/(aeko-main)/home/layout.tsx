export default function HomeLayout({
	children,
	stories
}: {
	children: React.ReactNode;

	stories: React.ReactNode;
}) {
	return (
		<>
			{children}
			<div className="block">{stories}</div>
		</>
	);
}
