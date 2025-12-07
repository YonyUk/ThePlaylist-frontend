import { IoSearch } from "react-icons/io5";

const SearchBar = () => {
    return (
        <div className="flex flex-row justify-center">
            <div className="w-fit flex flex-row bg-[#00000045] rounded-[30px] gap-5 items-center p-1">
                <div className="cursor-pointer hover:text-[#ffffff45] duration-500">
                    <IoSearch size={25}/>
                </div>
                <input
                type="text"
                name="search-bar"
                id="search-bar"
                placeholder="what are you looking for?"
                className="outline-none px-2 py-1 text-white rounded-[30px] border-1 border-[#ffffff65] text-3"
                />
            </div>
        </div>
    )
};

export default SearchBar;