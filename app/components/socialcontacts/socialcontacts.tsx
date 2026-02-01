import { MdOutlineEmail } from "react-icons/md";
import { RiFacebookBoxLine } from "react-icons/ri";
import { MdOutlinePhoneEnabled } from "react-icons/md";

interface SocialContactsProps {
    phone?: string;
    email?: string;
    facebook?: string;
    iconsSize: number;
    textColor?: string;
}

export default function SocialContacts({ phone, email, facebook, iconsSize,textColor }: SocialContactsProps) {
    return (
        <div className={`flex flex-col p-1 h-full ${textColor && `text-[${textColor}]`}`}>
            {
                phone &&
                <div className="flex flex-row items-center gap-2">
                    <MdOutlinePhoneEnabled size={iconsSize}/>
                    <small>{phone}</small>
                </div>
            }
            {
                email &&
                <div className="flex flex-row items-center gap-2">
                    <MdOutlineEmail size={iconsSize}/>
                    <small>{email}</small>
                </div>
            }
            {
                facebook &&
                <div className="flex flex-row items-center gap-2">
                    <RiFacebookBoxLine size={iconsSize}/>
                    <small>{facebook}</small>
                </div>
            }
        </div>
    )
}