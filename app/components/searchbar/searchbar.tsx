import { useState } from "react";
import { IoSearch } from "react-icons/io5";

interface SearchBarInput {
    onSearchClick?: (value: string) => void;
}

const SearchBar = ({ onSearchClick }: SearchBarInput) => {
    const [value,setValue] = useState('');

    return (
        <div className="flex flex-row justify-center">
            <div className="w-fit flex flex-row bg-[#00000045] rounded-[30px] gap-5 items-center p-1">
                <div className="cursor-pointer hover:text-[#ffffff45] duration-500"
                onClick={() => {
                    if (onSearchClick)
                        onSearchClick(value);
                }}
                >
                    <IoSearch size={25} />
                </div>
                <input
                    type="text"
                    name="search-bar"
                    id="search-bar"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        if (e.target.value.length === 0 && onSearchClick)
                            onSearchClick(e.target.value);
                    }}
                    placeholder="what are you looking for?"
                    className="outline-none px-2 py-1 text-white rounded-[30px] border-1 border-[#ffffff65] text-3"
                />
            </div>
        </div>
    )
};

export default SearchBar;