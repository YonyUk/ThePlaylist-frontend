import type React from "react";
import { memo, useMemo } from "react";

interface StatButtonProps {
    icon: React.ReactNode,
    value: number;
    isActive: boolean;
    isInteractive: boolean;
    onClick?: () => void;
    label: string;
}

const StatButton = memo<StatButtonProps>(({ 
    icon, 
    value, 
    isActive, 
    isInteractive, 
    onClick, 
    label 
}) => {
    const formattedValue = useMemo(() => {
        if (value < 1000) return `${value}`;
        if (value < 1000000) return `${Math.floor(value / 1000)}K`;
        if (value < 1000000000) return `${Math.floor(value / 1000000)}M`;
        return `${(value / 1000000000).toFixed(1)}B`;
    }, [value]);
    
    return (
        <button
            aria-label={`${label} - ${formattedValue}`}
            aria-pressed={isActive}
            onClick={onClick}
            disabled={!isInteractive}
            className={`
                flex flex-row gap-1 w-10 ${isInteractive && 'cursor-pointer' } justify-center items-center cursor-pointer rounded-md
            `}
        >
            {icon}
            <small className="text-[10px] font-medium tabular-nums">
                {formattedValue}
            </small>
        </button>
    );
});

StatButton.displayName = 'StatButton';

export default StatButton;