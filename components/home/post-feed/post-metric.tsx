const Metric = ({
	icon,
	value,
	className
}: {
	icon: React.ReactNode;
	value: string | number;
	className?: string;
}) => (
	<div className={`flex items-center space-x-2 ${className}`}>
		{icon}
		<span className="text-lg font-medium">{value}</span>
	</div>
);

export { Metric };
