export const getWidth = (width?: number | "full" | "fit") => {
    if (width) {
        switch (width) {
            case "full":
                return "w-full";

            case "fit":
                return "w-fit";

            default:
                return `w-[${width}px]`;
        }
    }
    return '';
}

export const getHeight = (height?: number | "full" | "fit") => {
    if (height) {
        switch (height) {
            case "full":
                return "h-full";

            case "fit":
                return "h-fit";

            default:
                return `h-[${height}px]`;
        }
    }
    return '';
}