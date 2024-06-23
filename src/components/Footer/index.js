import { FaRegCopyright } from "react-icons/fa";

function Footer() {
    return ( 
        <div className="flex flex-wrap justify-between bg-primary h-[76px] items-center">
            <div className="flex flex-wrap justify-between items-center h-16">
                <div className="pr-4 pl-4">
                    <div className="flex items-center font-semibold text-gray-500">
                        Copyright <p className="mx-2"><FaRegCopyright /></p> F-Math Website
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Footer;