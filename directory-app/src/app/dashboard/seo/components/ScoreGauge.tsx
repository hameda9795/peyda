"use client";

interface ScoreGaugeProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function ScoreGauge({ score, size = 'md', showLabel = true }: ScoreGaugeProps) {
    const getColor = (s: number) => {
        if (s >= 80) return 'text-green-500';
        if (s >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getBgColor = (s: number) => {
        if (s >= 80) return 'text-green-100';
        if (s >= 50) return 'text-yellow-100';
        return 'text-red-100';
    };

    const sizes = {
        sm: { width: 80, height: 80, stroke: 8, fontSize: 'text-xl' },
        md: { width: 128, height: 128, stroke: 12, fontSize: 'text-3xl' },
        lg: { width: 180, height: 180, stroke: 16, fontSize: 'text-5xl' }
    };

    const { width, height, stroke, fontSize } = sizes[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - score / 100);

    return (
        <div className="relative" style={{ width, height }}>
            <svg
                className="w-full h-full transform -rotate-90"
                viewBox={`0 0 ${width} ${width}`}
            >
                {/* Background circle */}
                <circle
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="none"
                    className={getBgColor(score)}
                />
                {/* Progress circle */}
                <circle
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`${getColor(score)} transition-all duration-1000 ease-out`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-bold ${getColor(score)} ${fontSize}`}>
                    {score}
                </span>
                {showLabel && (
                    <span className="text-xs text-slate-500 mt-1">/100</span>
                )}
            </div>
        </div>
    );
}
