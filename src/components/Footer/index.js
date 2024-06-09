import { FaRegCopyright } from "react-icons/fa";

function Footer() {
    return ( 
        <div class="flex flex-wrap justify-between bg-primary h-[76px] items-center">
            <div class="flex flex-wrap justify-between items-center h-16">
                <div class="pr-4 pl-4">
                    <div class="flex items-center font-semibold text-gray-500">
                        Copyright <p class="mx-2"><FaRegCopyright /></p> F-Math Website
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Footer;