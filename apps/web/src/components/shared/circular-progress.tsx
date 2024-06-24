interface CircularProgressBarProps {
	progress: number;
	size: number;
}

const CircularProgressBar = ({ progress, size }: CircularProgressBarProps) => {
	const strokeWidth = 12;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<div className="flex items-center justify-center">
			<svg width={size} height={size} className="-rotate-90 transform">
				<circle
					stroke="#e2e8f0"
					fill="transparent"
					strokeWidth={strokeWidth}
					r={radius}
					cx={size / 2}
					cy={size / 2}
				/>
				<circle
					stroke="#4f46e5"
					fill="transparent"
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					r={radius}
					cx={size / 2}
					cy={size / 2}
				/>
			</svg>
			<div className="absolute flex flex-col items-center justify-center">
				<p className="text-2xl font-bold text-indigo-600">4/6 Points</p>
			</div>
		</div>
	);
};

export default CircularProgressBar;
