import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from "react-icons/ai";
import { IoPlay } from "react-icons/io5";
import { memo, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import StatButton from "./statbutton";

export interface SocialControlsInterface {
    interactive?: boolean;
    likes?: number;
    dislikes?: number;
    reproductions?: number;
    hearts?: number;
    valued?: boolean;
    stat?: 'loved' | 'liked' | 'disliked' | 'none';
    already_liked?: boolean;
    already_disliked?: boolean;
    already_loved?: boolean;
    onLiked?: (value: boolean) => void;
    onDisliked?: (value: boolean) => void;
    onLoved?: (value: boolean) => void;
}

interface SocialStatsState {
    liked: boolean;
    disliked: boolean;
    loved: boolean;
    currentLikes: number;
    currentDislikes: number;
    currentHearts: number;
}

type SocialStatsAction =
    | { type: 'SET_INITIAL_VALUES'; payload: Partial<SocialStatsState> }
    | { type: 'TOGGLE_LIKE' }
    | { type: 'TOGGLE_DISLIKE' }
    | { type: 'TOOGLE_LOVE' }
    | { type: 'UPDATE_COUNTERS'; payload: Pick<SocialControlsInterface, 'likes' | 'dislikes' | 'hearts'> }
    | { type: 'RESET_INTERACTION' }

const socialStatsReducer = (state: SocialStatsState, action: SocialStatsAction): SocialStatsState => {
    switch (action.type) {
        case 'SET_INITIAL_VALUES':
            return { ...state, ...action.payload };

        case 'TOGGLE_LIKE': {

            const wasLiked = state.liked;
            const likeDelta = wasLiked ? -1 : 1;
            const resetOthers = !wasLiked;


            return {
                ...state,
                liked: !wasLiked,
                disliked: resetOthers ? false : state.disliked,
                loved: resetOthers ? false : state.loved,
                currentLikes: state.currentLikes + likeDelta,
                currentDislikes: resetOthers && state.disliked ? state.currentDislikes - 1 : state.currentDislikes,
                currentHearts: resetOthers && state.loved ? state.currentHearts - 1 : state.currentHearts
            };
        }

        case 'TOGGLE_DISLIKE': {

            const wasDisliked = state.disliked;
            const dislikeDelta = wasDisliked ? -1 : 1;
            const resetOthers = !wasDisliked;

            return {
                ...state,
                liked: resetOthers ? false : state.liked,
                disliked: !wasDisliked,
                loved: resetOthers ? false : state.loved,
                currentLikes: resetOthers && state.liked ? state.currentLikes - 1 : state.currentLikes,
                currentDislikes: state.currentDislikes + dislikeDelta,
                currentHearts: resetOthers && state.loved ? state.currentHearts - 1 : state.currentHearts
            };
        }

        case 'TOOGLE_LOVE': {
            const wasLoved = state.loved;
            const loveDelta = wasLoved ? -1 : 1;
            const resetOthers = !wasLoved;

            return {
                ...state,
                liked: resetOthers ? false : state.liked,
                disliked: resetOthers ? false : state.disliked,
                loved: !wasLoved,
                currentLikes: resetOthers && state.liked ? state.currentLikes - 1 : state.currentLikes,
                currentDislikes: resetOthers && state.disliked ? state.currentDislikes - 1 : state.currentDislikes,
                currentHearts: state.currentHearts + loveDelta
            };
        }

        case 'UPDATE_COUNTERS':

            return {
                ...state,
                currentLikes: action.payload.likes ?? state.currentLikes,
                currentDislikes: action.payload.dislikes ?? state.currentDislikes,
                currentHearts: action.payload.hearts ?? state.currentHearts
            };

        case 'RESET_INTERACTION':

            return {
                ...state,
                liked: false,
                disliked: false,
                loved: false
            };

        default:
            return state;
    }
}

const initialState: SocialStatsState = {
    liked: false,
    disliked: false,
    loved: false,
    currentLikes: 0,
    currentDislikes: 0,
    currentHearts: 0
}

const useSocialStats = (props: SocialControlsInterface) => {
    const [state, dispatch] = useReducer(socialStatsReducer, initialState);

    const isInteractive = props.interactive ?? false;

    useMemo(() => {
        dispatch({
            type: 'SET_INITIAL_VALUES',
            payload: {
                liked: props.already_liked ?? false,
                disliked: props.already_disliked ?? false,
                loved: props.already_loved ?? false,
                currentLikes: props.likes ?? 0,
                currentDislikes: props.dislikes ?? 0,
                currentHearts: props.hearts ?? 0
            }
        });
    }, [
        props.already_liked,
        props.already_disliked,
        props.already_loved,
        props.likes,
        props.dislikes,
        props.hearts
    ]);

    const handleLike = useCallback(() => {
        if (!isInteractive || !props.onLiked) return;
        const newLikedState = !state.liked;
        dispatch({ type: 'TOGGLE_LIKE' });
        props.onLiked(newLikedState);
    }, [isInteractive, props.onLiked, state.liked]);

    const handleDislike = useCallback(() => {
        if (!isInteractive || !props.onDisliked) return;
        const newDislikedState = !state.disliked;
        dispatch({ type: 'TOGGLE_DISLIKE' });
        props.onDisliked(newDislikedState);
    }, [isInteractive, props.onDisliked, state.disliked]);

    const handleLove = useCallback(() => {
        if (!isInteractive || !props.onLoved) return;
        const newLovedState = !state.loved;
        dispatch({ type: 'TOOGLE_LOVE' });
        props.onLoved(newLovedState);
    }, [isInteractive, props.onLoved, state.loved]);

    const hasInteraction = useMemo(() =>
        state.liked || state.disliked || state.loved,
        [state.liked, state.disliked, state.loved]
    );

    return {
        state,
        isInteractive,
        hasInteraction,
        handleLike,
        handleDislike,
        handleLove
    };
}

const SocialStats = memo(({
    hearts = 0,
    likes = 0,
    dislikes = 0,
    reproductions = 0,
    interactive = false,
    already_liked = false,
    already_disliked = false,
    already_loved = false,
    onLiked,
    onDisliked,
    onLoved
}: SocialControlsInterface) => {

    const {
        state,
        isInteractive,
        hasInteraction,
        handleLike,
        handleDislike,
        handleLove
    } = useSocialStats({
        likes,
        dislikes,
        hearts,
        reproductions,
        interactive,
        already_liked,
        already_disliked,
        already_loved,
        onLiked,
        onDisliked,
        onLoved
    });

    const formattedPlays = useMemo(() => {
        if (reproductions < 1000) return `${reproductions}`;
        if (reproductions < 1000000) return `${Math.floor(reproductions / 1000)}K`;
        if (reproductions < 1000000000) return `${Math.floor(reproductions / 1000000)}M`;
        return `${Math.floor(reproductions / 1000000000)}B`;
    }, [reproductions]);

    return (
        <div className="flex flex-row justify-bettwen gap-3 w-full mt-3">
            <StatButton
                label="Hearts"
                icon={state.loved ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
                value={state.currentHearts}
                isActive={state.loved}
                isInteractive={isInteractive && onLoved !== undefined}
                onClick={handleLove}
            />
            <StatButton
                label="Likes"
                icon={state.liked ? <AiFillLike size={15} /> : <AiOutlineLike size={15} />}
                value={state.currentLikes}
                isActive={state.liked}
                isInteractive={isInteractive && onLiked !== undefined}
                onClick={handleLike}
            />
            <StatButton
                label="Dislikes"
                icon={state.disliked ? <AiFillDislike size={15} /> : <AiOutlineDislike size={15} />}
                value={state.currentDislikes}
                isActive={state.disliked}
                isInteractive={isInteractive && onDisliked !== undefined}
                onClick={handleDislike}
            />
            <div className="flex flex-row gap-1 w-10 items-center">
                <IoPlay size={15} />
                <small className="text-[10px]">{formattedPlays}</small>
            </div>
        </div>
    )
});

SocialStats.displayName = 'SocialStats';

export default SocialStats;