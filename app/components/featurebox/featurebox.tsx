import { useState } from "react";

export interface FeatureBoxProps {
    features: string[];
    mainText: string;
    imgs: string[];
    replaceImageInterval: number;
    width?: string;
}

const sanitazeWidthValue = (value: string): boolean => {
    try {
        const width = parseInt(value);
        return true;
    } catch (error) {
        if ([...value].filter(l => l === '/').length !== 1)
            return false;
        const pos = value.indexOf('/');
        const left = value.substring(0, pos);
        const right = value.substring(pos);
        try {
            const l = parseInt(left);
            const r = parseInt(right);
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default function FeatureBox({ features, mainText, imgs, width, replaceImageInterval }: FeatureBoxProps) {
    const [currentIndex,setCurrentIndex] = useState(0);

    setInterval(() => setCurrentIndex((currentIndex + 1) % imgs.length),replaceImageInterval);

    return (
        <div className={`flex flex-col ${width && sanitazeWidthValue(width) && `w-${width}`}
        ${!width && 'w-full'} h-full rounded-md bg-[#00000045] m-2 p-1`}>
            <h1 className="flex flex-row w-full justify-center items-center">{mainText}</h1>
            <div className={`flex h-7/10
            w-full self-center items-self-center backdrop-blur-xs 
            bg-[#00000025] p-5 -px-100 rounded-md relative`}>
                {
                    imgs.map((img,index) => (
                        <img src={img}
                        className={`absolute inset-0 w-full h-full object-contain
                            transition-opacity rounded-md
                            duration-1000 ${currentIndex === index ? "opacity-100" : "opacity-0"}`}
                        data-fade-index={`${index}`}
                        />
                    ))
                }
            </div>
            <ul className="flex flex-col justify-center items-start h-fit w-full break-words">
                {
                    features.map((item, index) => (
                        <h1
                            key={index}>
                            {`- ${item}`}
                        </h1>
                    ))
                }
            </ul>
        </div>
    )
}