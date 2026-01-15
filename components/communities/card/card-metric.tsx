const Metric = ({
	icon,
	value,
	className,
	onClick
}: {
	icon: React.ReactNode;
	value: string | number;
	className?: string;
	onClick?: () => void;
}) => (
	<div
		className={`flex items-center space-x-2 ${className}`}
		onClick={onClick}
	>
		{icon}
		<span className="text-lg font-medium">{value}</span>
	</div>
);

export { Metric };
