import { TiThMenu } from 'react-icons/ti'
import { IoHomeSharp } from 'react-icons/io5'
import { BsMusicNoteList } from 'react-icons/bs'
import { IoMdContact } from 'react-icons/io'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/routes'


const SideBar = () => {

    const menuItems = [
        {
            icon: <IoHomeSharp size={30} />,
            label: 'Home',
            url: ROUTES.HOME
        },
        {
            icon: <BsMusicNoteList size={30} />,
            label: 'Playlists',
            url: ROUTES.PLAYLISTS
        }
    ]

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className={`h-screen bg-[#00000040] p-2 flex flex-col duration-500 text-white backdrop-blur-sm ${isOpen ? 'w-80' : 'w-16'} fixed z-10 inset-0`}>
            {/* Header */}
            <div className='px-3 py-2 h-20 justify-between items-center'>
                <div><TiThMenu size={34}
                    className={` duration-500 cursor-pointer ${!isOpen && ' rotate-180'}`}
                    onClick={() => setIsOpen(!isOpen)} />
                </div>
            </div>
            {/* Body */}
            <ul className='flex-1'>
                {
                    menuItems.map((item, index) => {
                        return (
                            <li key={index}
                                className='px-3 py-2 my-2 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group hover:bg-[#00000045]'
                                onClick={(e) => navigate(item.url)}
                            >
                                <div>{item.icon}</div>
                                <p className={`${!isOpen && 'w-0 '} duration-500 overflow-hidden`}>{item.label}</p>
                                <p className={`${isOpen && 'hidden'} absolute left-32 shadow-lg rounded-lg
                                w-0 p-0 duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16
                                `}>{item.label}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
    )
}

export default SideBar