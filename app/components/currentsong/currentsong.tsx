import type { TrackDTO } from "~/dtos/trackdto";
import SocialStats from "../socialstats/socialstats";
import React, { useCallback, useMemo } from "react";

interface CurrentSongInput extends TrackDTO {
    liked?: boolean;
    disliked?: boolean;
    loved?: boolean;
    width?: number;
    height?: number;
    onLiked: (value: boolean) => void;
    onDisliked: (value: boolean) => void;
    onLoved: (value: boolean) => void;
}

const CHAR_WIDTH_NAME = 15;
const CHAR_WIDTH_AUTHOR = 13.28;
const BASE_OFFSET_NAME = 50;
const BASE_OFFSET_AUTHOR = 45;
const SCROLL_THRESHOLD_NAME = 21;
const SCROLL_THRESHOLD_AUTHOR = 25;
const ANIMATION_FACTOR = 5;

const useScrollAnimation = (text: string, isName: boolean) => {
    return useMemo(() => {
        const threshold = isName ? SCROLL_THRESHOLD_NAME : SCROLL_THRESHOLD_AUTHOR;
        const charWidth = isName ? CHAR_WIDTH_NAME : CHAR_WIDTH_AUTHOR;
        const baseOffset = isName ? BASE_OFFSET_NAME : BASE_OFFSET_AUTHOR;

        if (text.length < threshold)
            return null;

        const offset = (text.length / 2) * charWidth;
        const duration = ANIMATION_FACTOR * (text.length / 4);
        const animationName = isName ? 'scrollNameLeft' : 'scrollAuthorLeft';

        return {
            animation: `${animationName} ${duration}s linear infinite`,
            transform: `translateX(${baseOffset + offset}px)`
        } as React.CSSProperties;
    }, [text, isName]);
}

const CurrentSong = (
    {
        name,
        img,
        author_name,
        plays,
        likes,
        dislikes,
        loves,
        liked,
        disliked,
        loved,
        width,
        height,
        onLiked,
        onDisliked,
        onLoved
    }: CurrentSongInput
) => {

    const nameOffset = (name.length / 2) * 15;
    const authorOffset = (author_name.length / 2) * 13.28;

    const valued = liked === true || disliked === true || loved === true;
    const stat = liked === true ?
        'liked' : disliked === true ?
            'disliked' : loved === true ?
                'loved' : 'none';

    const nameAnimationStyle = useScrollAnimation(name, true);
    const authorAnimationStyle = useScrollAnimation(author_name, false);

    const dynamicStyles = useMemo(() => {
        const styles: string[] = [];
        if (nameAnimationStyle) {
            const offset = (name.length / 2) * CHAR_WIDTH_NAME;
            styles.push(
                `
                @keyframes scrollNameLeft {
                    0%{ transform: translateX(${BASE_OFFSET_NAME + offset}px); }
                    100%{ transform: translateX(-${BASE_OFFSET_NAME + offset}px); }
                }
                `
            );
        }

        if (authorAnimationStyle) {
            const offset = (author_name.length / 2) * CHAR_WIDTH_AUTHOR;
            styles.push(
                `
                @keyframes scrollAuthorLeft {
                    0%{ transform: translateX(${BASE_OFFSET_AUTHOR + offset}px); }
                    100%{ transform: translateX(-${BASE_OFFSET_AUTHOR + offset}px); }
                }
                `
            );
        }

        return styles.join('');
    }, [name, author_name, nameAnimationStyle, authorAnimationStyle]);

    useMemo(() => {
        if (dynamicStyles && typeof document !== 'undefined') {
            const styleId = 'current-song-dynamic-styles';
            let styleElement = document.getElementById(styleId) as HTMLStyleElement;

            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }

            styleElement.textContent = dynamicStyles;
        }
    }, [dynamicStyles]);

    const handleLiked = useCallback((value: boolean) => {
        onLiked(value);
    }, [onLiked]);

    const handleDisliked = useCallback((value: boolean) => {
        onDisliked(value);
    }, [onDisliked]);

    const handleLoved = useCallback((value: boolean) => {
        onLoved(value);
    }, [onLoved]);

    return (
        <div style={{
            width: width ?? 50,
            height: height ?? 65
        }}
            className="flex flex-col gap-2 p-3 bg-[#00000045] rounded-md items-center overflow-hidden">
            {/* Name header*/}
            <div className="flex flex-row justify-center w-max text-[15px] overflow-hidden">
                {
                    nameAnimationStyle ? (
                        <div><h1 style={nameAnimationStyle}>{name}</h1></div>
                    ) : (
                        <h1 className="truncate max-w-full">{name}</h1>
                    )
                }
            </div>
            {
                img ? (
                    <img src={img} alt={`song-${name}-img`}></img>
                ) : (
                    <div className="flex h-[60%] w-full bg-[#00000025] justify-center items-center rounded-md">
                        <h1>No image</h1>
                    </div>
                )
            }
            {/* Author header*/}
            <div className="flex flex-row justify-center w-full text-[12px] overflow-hidden px-3">
                {authorAnimationStyle ? (
                    <h1 style={authorAnimationStyle}>{author_name}</h1>
                ) : (
                    <h1>{author_name}</h1>
                )
                }
            </div>
            <SocialStats interactive={true}
                likes={likes}
                dislikes={dislikes}
                hearts={loves}
                reproductions={plays}
                already_liked={liked}
                already_disliked={disliked}
                already_loved={loved}
                valued={valued}
                stat={stat}
                onLiked={handleLiked}
                onDisliked={handleDisliked}
                onLoved={handleLoved}
            />
        </div>
    )
};

export default CurrentSong;