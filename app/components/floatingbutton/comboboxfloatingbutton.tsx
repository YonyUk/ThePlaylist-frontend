import { useState, type JSX } from "react";
import { IoAdd } from "react-icons/io5";

export interface ComboboxFloatingButtonOption {
    description: string;
    onSelect?: () => Promise<boolean>;
    onDeselect?: () => Promise<boolean>;
    primaryIcon: JSX.Element;
    secondaryIcon: JSX.Element;
    primary?: boolean;
}

interface FloatingButtonProps {
    growDirection: "col" | "row";
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    iconSize?: number;
    height?: number;
    options: ComboboxFloatingButtonOption[];
    refreshFunc?: () => void;
}

const getMargins = (left?: number, right?: number, top?: number, bottom?: number) => {
    const l = left ? `left-${left} ` : '';
    const r = right ? `right-${right} ` : '';
    const t = top ? `top-${top} ` : '';
    const b = bottom ? `bottom-${bottom}` : '';

    return `${l}${r}${t}${b}`;
}

export default function ComboBoxFloatingButton({
    growDirection,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    iconSize,
    options,
    height,
    refreshFunc
}: FloatingButtonProps) {
    const [isClicked, setIsClicked] = useState(false);
    return (
        <div
            className={`flex flex-${growDirection} justify-end items-center p-2 gap-2 bg-[#ffffff35] rounded-full
            fixed ${getMargins(marginLeft, marginRight, marginTop, marginBottom)} overflow-hidden
            ${!isClicked ? 'h-11' : `h-${height ?? 20}`} duration-500
            `}
        >
            {
                options.map((item, index) => (
                    <button className={`
                        ${(options.every((v, _) => v.primary) || item.primary !== true) && "cursor-pointer hover:bg-[#00000025]"} 
                        duration-500 p-1 rounded-full`}
                        key={index}
                        disabled={options.some((v, _) => !v.primary && item.primary === true)}
                        onClick={() => {
                            if (item.primary === true && item.onSelect) {
                                item.onSelect().then(resp => {
                                    if (resp && refreshFunc)
                                        refreshFunc();
                                });
                            }
                            else if (item.primary !== true && item.onDeselect) {
                                item.onDeselect().then(resp => {
                                    if (resp && refreshFunc)
                                        refreshFunc();
                                })
                            }
                        }}
                    >
                        {item.primary === true && item.primaryIcon}
                        {item.primary !== true && item.secondaryIcon}
                    </button>
                ))
            }
            <button className={`hover:cursor-pointer duration-500 ${isClicked && 'rotate-45'}`}
                onClick={() => setIsClicked(!isClicked)}
            >
                <IoAdd size={iconSize ?? 20} />
            </button>
        </div>
    )
}