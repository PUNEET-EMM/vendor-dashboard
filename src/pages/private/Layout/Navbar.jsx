import { Link, useNavigate } from "react-router-dom";
import logo from '../../../assets/image 3.png'
import profileIcon from '../../../assets/My Profile Icon.png'



export default function Navbar({ logoSrc, profileSrc }) {
    const navigate = useNavigate();





    return (
        <header className="fixed top-0 inset-x-0 z-50 h-16 md:h-20 bg-white shadow">
            <div className="mx-auto max-full h-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between gap-2">
                {/* Logo */}
                <Link to="/app" className="shrink-0 flex items-center gap-2">
                    <img
                        src={logoSrc || logo}
                        alt="Logo"
                        className="h-10 md:h-12 w-auto rounded-[8px]"
                    />
                </Link>



                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

                    <Link
                        to="/vendor/profile"
                        className="flex items-center gap-2 text-sm md:text-base"
                    >
                        <img
                            src={profileSrc || profileIcon}
                            alt="Profile"
                            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10"
                        />
                        <span className="hidden sm:inline text-gray-800 ">
                            My Profile
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
}




