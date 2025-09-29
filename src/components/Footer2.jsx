
const Footer2 =() => (
<footer className="bg-white rounded-lg shadow-sm dark:bg-gray-900 m-4">
  <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
    <div className="sm:flex sm:items-center sm:justify-between">
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
      <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            About
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline me-4 md:me-6">
            Licensing
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </li>
      </ul>
    </div>
    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
      © 2023{" "}
      <a href="https://flowbite.com/" className="hover:underline">
        Flowbite™
      </a>
      . All Rights Reserved.
    </span>
  </div>
</footer>

)

export default Footer2;
