import FeatureBox, { type FeatureBoxProps } from "~/components/featurebox/featurebox";
import type { Route } from "./+types/home";
import track_ranking from 'app/assets/images/track_ranking.png';
import upload_tracks from 'app/assets/images/upload_trackspng.png';
import manage_tracks from 'app/assets/images/manage_tracks.png';
import manage_playlists from 'app/assets/images/manage_playlists.png';
import manage_playlist_content from 'app/assets/images/manage_playlist_content.png';
import manage_playlist_content_2 from 'app/assets/images/manage_playlist_content_2.png';
import playlist_ranking from 'app/assets/images/playlist_ranking.png';

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {

	const replaceImageInterval = 5000;

	const features: FeatureBoxProps[] = [
		{
			replaceImageInterval,
			mainText: 'Tracks',
			features: [
				"tracks ranking",
				"upload your own tracks from your local storage",
				"keep control over your own uploaded tracks",
				"delete your own uploaded tracks whenever you want"
			],
			imgs: [
				track_ranking,
				upload_tracks,
				manage_tracks
			]
		}, {
			replaceImageInterval,
			mainText: 'Playlists',
			features: [
				'complete manage of your own playlists',
				'playlists ranking',
				'add tracks from your local storage or directly from your uploaded tracks'
			],
			imgs: [
				manage_playlists,
				manage_playlist_content,
				manage_playlist_content_2,
				playlist_ranking,
			]
		}
	]

	const width = Math.floor(100 / features.length);

	return (
		<div className="flex flex-col h-full w-full overflow-y-auto overflow-x-hidden p-2 pl-18
    	[&::-webkit-scrollbar]:w-2
    	[&::-webkit-scrollbar-track]:rounded-full
    	[&::-webkit-scrollbar-thumb]:bg-[#ffffff35]
    	[&::-webkit-scrollbar-thumb]:rounded-full
    	[&::-webkit-scrollbar-thumb:hover]:bg-[#ffffff65]
    	[&::-webkit-scrollbar-thumb:hover]:cursor-pointer
    
    	scrollbar-thin
    	scrollbar-thumb-gray-400
    	scrollbar-track-gray-100
    	scrollbar-track-rounded
    	scrollbar-thumb-rounded"
		>
			<div className="flex flex-col justify-center items-center bg-[#00000045] rounded-md w-full">
				<div className="text-[50px]">
					ThePlaylist
				</div>
				<div className="m-3 text-[#ffffffb5] text-center">
					Where people connect through their musical tastes and music is the language
				</div>
			</div>
			<div className="flex justify-center items-center h-fit w-full p-2 text-[30px]">
				What you can do?
			</div>
			<div className="flex flex-row justify-around items-start w-full min-h-2/5">
				{
					features.map((item, index) => (
						<FeatureBox key={index}
							mainText={item.mainText}
							features={item.features}
							width={width < 100 ? `${width}/100` : 'full'}
							imgs={item.imgs}
							replaceImageInterval={item.replaceImageInterval}
						/>
					))
				}
			</div>
		</div>
	);
}
