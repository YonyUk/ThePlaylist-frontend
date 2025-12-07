import SearchBar from "~/components/searchbar/searchbar";
import SideBar from "~/components/sidebar/sidebar";

const PlayLists = () => {

    return (
        <div className="p-3 pl-18 flex flex-col">
            <SideBar />
            <SearchBar />
        </div>
    )

};

export default PlayLists;