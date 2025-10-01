import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

const Navbar = () => {
    const {user, signOutUser} = useContext(UserContext);
 
    const handleClickLogout = async() => {
    try {
        await signOutUser();
    } catch (error) {
        console.log(error);
    }
    }
    return (
    <div>
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="logo-container flex items-center space-x-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={60}
                height={60}
                viewBox="0 0 60 60"
                className="text-indigo-600"
            >
                <rect
                x={0}
                y={0}
                width={60}
                height={60}
                rx={10}
                ry={10}
                className="fill-current opacity-10"
                />
                <path
                d="M 15 15 L 30 45 L 45 15 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>
            <span className="text-5xl font-bold text-gray-500 tracking-wider">
                TDS<span className="font-light text-indigo-600">Labs</span>
            </span>
            </div>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                {user? (
                <li>
                    <a
                        href="#"
                        className="block py-2 px-3 text-gray-300 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                        <NavLink to="/locaciones">Locaciones</NavLink>
                </a>
                </li>
                ):(
                    <></>
                )}
                    {user? (
                <li>
                    <a
                        href="#"
                        className="block py-2 px-3 text-gray-300 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                        <NavLink to="/grafico">Gráfico</NavLink>
                </a>
                </li>
                ):(
                    <></>
                )}
                 {user? (
                <li>
                    <a
                        href="#"
                        className="block py-2 px-3 text-gray-300 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                        <NavLink to="/mapa">Mapa</NavLink>
                </a>
                </li>
                ):(
                    <></>
                )}
                {user? (
                    <li>
                        <a
                            className="block py-2 px-3 text-gray-300 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                            aria-current="page"
                        >
                        <NavLink to="/">Inicio</NavLink>
                        </a>
                    </li>
                    ):(
                    <li>
                        <a
                            className="block py-2 px-3 text-gray-300 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                            aria-current="page"
                        >
                        <NavLink to="/login">Login </NavLink>
                        </a>
                    </li>
                    )}
                {user? (
                    <li>
                        <a
                            href="#"
                            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                        >
                        <button 
                            onClick={handleClickLogout}>Cerrar Sesion
                        </button>
                        </a>
                    </li>
                ):(
                    <li>
                        <a
                            className="block py-2 px-3 text-gray-300 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                            aria-current="page"
                        >
                        <NavLink to="/register"> Register </NavLink>
                        </a>
                    </li>
                )}

        {/* <li>
          <a
            href="#"
            className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
          >
            Pricing
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
          >
            Contact
          </a>
        </li> */}
      </ul>
    </div>
  </div>
</nav>

         {/* <div>
            <button 
                onClick={handleClickLogout}>| Cerrar Sesion |
            </button>
            {user ? (
                <>
                    <NavLink to="/"> Inicio </NavLink>
                </>
            ):(
                <>
                    <NavLink to="/login"> Login </NavLink>
                    <NavLink to="/register"> Register </NavLink>
                </>
            )}
        </div>  */}
        </div>
    );
}

export default Navbar;