import Footer from "../components/Footer";

const Home = () => {
    return (
        <div>
        <div>
            <section className="bg-center bg-no-repeat bg-[url('https://firebasestorage.googleapis.com/v0/b/lab-seeds.appspot.com/o/imagenes%2Fagua_rio_tomamuestra.png?alt=media&token=633050dd-a257-4d8d-8001-9dd04960c114')] bg-gray-600 bg-blend-multiply">
                <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
                    ¿Qué estamos investigando actualmente?
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
                    Nos encontramos investigando si el agua que consumimos está en los estándares básicos permitidos 
                    para el consumo humano y también su respectivo monitoreo en caso de salirse de un determinado rango 
                    debido que puede contener elementos que hacen que no sea apta ni para el uso humano ni regadíos.
                    </p>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
                    <a
                        href="#"
                        className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
                    >
                        Empecemos!
                        <svg
                        className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                        >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
                    >
                        Learn more
                    </a>
                    </div>
                </div>
                </section>
        </div>
            <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8">
                <a
                    href="#"
                    className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-blue-400 mb-2"
                >
                    <svg
                    className="w-2.5 h-2.5 me-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 14"
                    >
                    <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
                    </svg>
                    Tutorial
                </a>
                <h1 className="text-gray-900 dark:text-white text-3xl md:text-5xl font-extrabold mb-2">
                    ¿Qué es lo que estamos haciendo como equipo?
                </h1>
                <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">
                    Nosotros como equipo nos dedicamos a realizar tomas de muestras de agua
                    ya sea de la llave o curso fluvial y ver su calidad analizando dureza con
                    su respectivo valor en PPM, ver si contiene metales pesados o si contiene 
                    compuestos orgánicos. Una vez analizados se llevan a un formulario desarrollado
                    en una App móvil el que registra la toma toma de muestra y georeferencia el 
                    lugar, adjuntando fotos, una desripción, región comuna y sus respectivos valores PPM.
                </p>
                <a
                    href="#"
                    className="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
                >
                    Read more
                    <svg
                    className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                    >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                    </svg>
                </a>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
                    <a
                    href="#"
                    className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 mb-2"
                    >
                    <svg
                        className="w-2.5 h-2.5 me-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 18"
                    >
                        <path d="M17 11h-2.722L8 17.278a5.512 5.512 0 0 1-.9.722H17a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM6 0H1a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V1a1 1 0 0 0-1-1ZM3.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16.132 4.9 12.6 1.368a1 1 0 0 0-1.414 0L9 3.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
                    </svg>
                    Design
                    </a>
                    <h2 className="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">
                    Tecnologías utilizadas
                    </h2>
                    <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4">
                    Para el desarrollo de la App móvil, se utilizó el framework React-Native, ya que 
                    se considera un framework dinámico el que permite compilar aplicaciones tanto para 
                    sistemas Android como iOS. Para la capa de datos se utiliza Firestore que es una 
                    base de datos no relacional de Google perteneiente a Firebase. 
                    
                    </p>
                    <a
                    href="#"
                    className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center"
                    >
                    Read more
                    <svg
                        className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                    </a>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
                    <a
                    href="#"
                    className="bg-purple-100 text-purple-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-purple-400 mb-2"
                    >
                    <svg
                        className="w-2.5 h-2.5 me-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                    >
                        <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 4 1 8l4 4m10-8 4 4-4 4M11 1 9 15"
                        />
                    </svg>
                    Code
                    </a>
                    <h2 className="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">
                    Best react libraries around the web
                    </h2>
                    <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4">
                    Static websites are now used to bootstrap lots of websites and are
                    becoming the basis for a variety of tools that even influence both web
                    designers and developers.
                    </p>
                    <a
                    href="#"
                    className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center"
                    >
                    Read more
                    <svg
                        className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                    </a>
                </div>
                </div>
            </div>


                    <div>
                    <Footer />
                  </div>
            </section>
              
        </div>
    );
}

export default Home;