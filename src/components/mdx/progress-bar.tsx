interface ProgressBarProps {
	value: number;
	label?: string;
}
const ProgressBar = ({ value, label }: ProgressBarProps) => {
	return (
		<div className="my-6">
			{label && (
				<div className="flex justify-between mb-2">
					<span className="text-sm font-medium">{label}</span>
					<span className="text-sm font-medium">{value}%</span>
				</div>
			)}
			<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
				<div
					className="bg-blue-600 h-4 rounded-full transition-all duration-300"
					style={{ width: `${value}%` }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
