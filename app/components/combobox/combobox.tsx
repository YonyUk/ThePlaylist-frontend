import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface ComboBoxInput {
    height: number;
    width: number;
    options: string[];
    defaultValue: string;
    iconSize: number;
    textSize?: number;
    onSelect: (value: string) => void
}

export default function ComboBox({ width, textSize, height, options, iconSize, defaultValue, onSelect }: ComboBoxInput) {

    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectedOption = (option: string, index: number) => {
        onSelect(option);
        setSelectedIndex(index);
        setSelectedOption(option);
        setIsOpen(false);
    }

    return (
        <div className={`flex flex-col justify-start items-center hover:bg-[#00000045]
        rounded-md border-[1px] border-[#ffffff65]
        duration-500 overflow-y-auto overflow-x-hidden ${isOpen && `bg-[#00000045]`}`}>
            <div
                style={{
                    width,
                    fontSize: textSize ?? 15
                }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-row m-1 cursor-pointer justify-bettwen w-full items-center gap-2">
                <h1 className={`overflow-y-hidden h-5 w-full ${selectedIndex === 0 ? "text-[#ffffff65]" : "text-white"}`}>{selectedOption}</h1>
                <div
                    className={`hover: duration-500 ${isOpen && 'rotate-180'} flex-start`}>
                    <FaChevronDown size={iconSize} />
                </div>
            </div>
            {
                <div className={`
                            absolute
                            rounded-b-md
                            duration-500
                            overflow-y-hidden
                            mt-6
                            p-1
                            ${isOpen && `bg-[#00000045] backdrop-blur-xs`}
                        `}
                    style={{
                        width: width + 8,
                        height: !isOpen ? 0 : height,
                        fontSize: textSize ?? 15
                    }}>
                    {
                        options.map((option, index) => (
                            <h1 key={index + 1}
                                className="flex hover:bg-[#00000045] rounded-md duration-500 cursor-pointer justify-center"
                                onClick={() => handleSelectedOption(option, index + 1)}
                            >{option}</h1>
                        ))
                    }
                </div>
            }
        </div>
    )
}