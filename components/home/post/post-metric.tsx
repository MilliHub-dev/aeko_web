import clsx from "clsx";

const Metric = ({
	icon,
	value,
	className,
	onClick
}: {
	icon: React.ReactNode;
	value?: string | number;
	className?: string;
	onClick?: () => void;
}) => {
	return (
		<div
			className={clsx(
				"flex lg:flex-col items-center space-x-1 lg:space-y-2 lg:space-x-0",
				className
			)}
			onClick={onClick}
		>
			{icon}
			<span className="text-lg font-medium">
				{value}
			</span>
		</div>
	);
};

export { Metric };
