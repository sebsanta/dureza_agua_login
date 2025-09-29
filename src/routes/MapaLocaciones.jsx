import React, { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';
import { collection, getDocs, Timestamp} from "firebase/firestore";
import { db } from '../firebase';
import Footer from '../components/Footer';

// Función para convertir Timestamps de Firebase
const convertFirebaseTimestamps = (data) => {
  const converted = { ...data };
  
  Object.keys(converted).forEach(key => {
    const value = converted[key];
    
    // Si es un Timestamp de Firebase
    if (value instanceof Timestamp) {
      converted[key] = value.toDate().toLocaleString('es-CL', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    // Si es un objeto con seconds y nanoseconds (Timestamp serializado)
    else if (value && typeof value === 'object' && value.seconds && value.nanoseconds) {
      converted[key] = new Date(value.seconds * 1000).toLocaleString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit', 
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    // Si es un objeto anidado, aplicar recursivamente
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      converted[key] = convertFirebaseTimestamps(value);
    }
  });
  
  return converted;
};


// 📍 PASO 1: DATOS SIMULADOS DE TU FIREBASE
// Estos datos simulan lo que obtienes de tu colección "Locaciones"
const mockFirebaseData = [
  {
    id: 'x9QPm4LvvrDkRaw9fAzB', // ID único del documento en Firebase
    comuna: 'Puente Alto',  // Campo "comuna" de tu documento
    direccion: 'Avenida Tobalaba 1600', // Campo "direccion" de tu documento
    descripcion: 'Agua de la llave cocina',// Campo "descripcion" de tu documento
    createdAt:'1 de abril de 2021, 2:44:10 p.m. UTC-3', // Campo "createdAt" de tu documento
    location: {                 // Objeto "location" que contiene las coordenadas
      latitude: -33.587823,     // latitud desde location.latitude
      longitude: -70.5473126,   // longitud desde location.longitude
      latitudeDelta: 0.001,     // Delta de latitud (para zoom)
      longitudeDelta: 0.001     // Delta de longitud (para zoom)
    },
    ppm: '589',                 // Partes por millón (calidad del agua)
    //quantityVoting: 0,          // Cantidad de votos recibidos
    //rating: 0,                  // Rating promedio
    //ratingTotal: 0,             // Total de rating acumulado
    region: 'Metropolitana',    // Región a la que pertenece
    images: [                   // Array de imágenes asociadas
      'https://firebasestorage.googleapis.com/v0/b/medidor-agua-b5a83.appspot.com/o/locaciones%2Faca93a1c7-e252-49b0-bda7-6aca906272c6?alt=media&token=62c802f7-fbda-48a5-a7af-99f337e2dbe4'
    ]
  },
  {
    id: '2zPwKXs2ThUBfxThzB3d',            // ID único del documento en Firebase
    comuna: 'Chépica',                   // Campo "comuna" de tu documento
    direccion: 'Puente Cabrerío',          // Campo "direccion" de tu documento
    descripcion: 'APR agua potable rural', // Campo "descripcion" de tu documento
    createdAt:'17 de junio de 2022, 12:35:55 a.m. UTC-4', // Campo "createdAt" de tu documento
    location: {                          // Objeto "location" que contiene las coordenadas
      latitude: -34.717730358682914,     // latitud desde location.latitude
      longitude: -71.19288196787238,     // longitud desde location.longitude
      latitudeDelta: 0.001,              // Delta de latitud (para zoom)
      longitudeDelta: 0.001              // Delta de longitud (para zoom)
    },
    ppm: '243',                          // Partes por millón (calidad del agua)
    //quantityVoting: 0,                   // Cantidad de votos recibidos
    //rating: 0,                           // Rating promedio
    //ratingTotal: 0,                      // Total de rating acumulado
    region: 'VI Región del Maule',       // Región a la que pertenece
    images: [                            // Array de imágenes asociadas
      'https://firebasestorage.googleapis.com/v0/b/medidor-agua-b5a83.appspot.com/o/locaciones%2Faca93a1c7-e252-49b0-bda7-6aca906272c6?alt=media&token=62c802f7-fbda-48a5-a7af-99f337e2dbe4'
    ]
  }

];

// 🗺️ PASO 2: COMPONENTE DEL MAPA (usando Leaflet)
const LeafletMap = ({ points, onPointClick }) => {
  // Referencias para el DOM y la instancia del mapa
  const mapRef = React.useRef(null);           // Referencia al div donde va el mapa
  const mapInstanceRef = React.useRef(null);   // Referencia a la instancia de Leaflet
  const markersRef = React.useRef([]);         // Referencia a los marcadores en el mapa

  // Efecto que se ejecuta una vez para inicializar Leaflet
  useEffect(() => {
    // Cargar CSS de Leaflet si no está cargado
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
      document.head.appendChild(link);
    }

    // Cargar JavaScript de Leaflet si no está cargado
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js';
      script.onload = initializeMap; // Cuando carge, inicializa el mapa
      document.body.appendChild(script);
    } else {
      initializeMap(); // Si ya está cargado, inicializa directamente
    }

    // Cleanup: remover el mapa cuando el componente se desmonte
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  // Efecto que actualiza los marcadores cuando cambian los puntos
  useEffect(() => {
    if (mapInstanceRef.current && points.length > 0) {
      updateMarkers();
    }
  }, [points]);

  // 🌍 FUNCIÓN PARA INICIALIZAR EL MAPA
  const initializeMap = () => {
    if (mapRef.current && window.L) {
      // Crear la instancia del mapa centrada en Santiago, Chile
      mapInstanceRef.current = window.L.map(mapRef.current).setView([-33.4489, -70.6693], 10);

      // Agregar las tiles (capas de mapa) de OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetMap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Actualizar marcadores después de crear el mapa
      updateMarkers();
    }
  };

  // 📌 FUNCIÓN PARA ACTUALIZAR MARCADORES
  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    // Limpiar marcadores existentes del mapa
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Crear un marcador para cada punto de datos
    points.forEach(point => {
      // Extraer coordenadas del objeto location
      const lat = parseFloat(point.location.latitude);   // Tu latitude desde Firebase
      const lng = parseFloat(point.location.longitude);  // Tu longitude desde Firebase
      
      // Crear el marcador en el mapa
      const marker = window.L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <div style="margin: 8px 0;">
              <strong style="color: #2563eb;">Región: </strong> ${point.region}
            </div>
            <div style="margin: 8px 0;">
              <strong style="color: #2563eb;">Comuna: </strong> ${point.comuna}
            </div>
              <div style="margin: 8px 0;">
              <strong style="color: #2563eb;">Dirección:</strong> ${point.direccion}
            </div>
            <div style="margin: 8px 0;">
              <strong style="color: #2563eb;">PPM:</strong> ${point.ppm}
            </div>
             <div style="margin: 8px 0;">
              <strong style="color: #2563eb;">Fecha:</strong> ${point.createdAt}
            </div>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #999;">
              📍 ${point.location.latitude}, ${point.location.latitude}
            </p>
            ${point.images && point.images.length > 0 ? 
              `<img src="${point.images[0]}" style="width: 100%; max-width: 290px; height: 250px; object-fit: cover; border-radius: 4px; margin-top: 8px;" alt="Imagen de ${point.comuna}"/>` 
              : ''
            }
          </div>
        `);

      // Agregar evento click al marcador
      marker.on('click', () => {
        onPointClick && onPointClick(point);
      });

      // Guardar referencia del marcador
      markersRef.current.push(marker);
    });

    // Ajustar la vista del mapa para mostrar todos los puntos
    if (points.length > 0) {
      const group = new window.L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  // Renderizar el contenedor del mapa
  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '8px',
        border: '2px solid #e5e7eb'
      }}
    />
  );
};

const MapaLocaciones = () => {

 // Estados para manejar los datos y la UI
  const [points, setPoints] = useState([]);        // Array de puntos desde Firebase
  const [selectedPoint, setSelectedPoint] = useState(null); // Punto actualmente seleccionado
  const [loading, setLoading] = useState(true);    // Estado de carga
  const [error, setError] = useState(null);        // Estado de error

  // Efecto que simula la carga desde Firebase al montar el componente
  useEffect(() => {
    const fetchPointsFromFirebase = async () => {
      try {
        setLoading(true);
        
        // 🔥 AQUÍ VAS A REEMPLAZAR CON TU CÓDIGO REAL DE FIREBASE:
        
        const querySnapshot = await getDocs(collection(db, 'Locaciones'));
        const pointsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return{
                 id: doc.id,
                ...convertFirebaseTimestamps(data)
            };
        });
        setPoints(pointsData);
        
        
        // Por ahora, simulamos la carga con un delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPoints(pointsData);
        setError(null);
        
      } catch (err) {
        setError('Error al cargar los puntos desde Firebase');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsFromFirebase();
  }, []);

  // Manejador para cuando se hace click en un punto
  const handlePointClick = (point) => {
    setSelectedPoint(point);
  };

  // Función para refrescar los datos
  const refreshPoints = () => {
    setPoints([]);
    setSelectedPoint(null);
    setTimeout(() => {
      setPoints(pointsData);
    }, 500);
  };

  // 🔄 ESTADOS DE CARGA Y ERROR
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ubicaciones desde Firebase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refreshPoints}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // 🎨 RENDERIZADO PRINCIPAL
  return (
  <div className="min-h-screen bg-gray-900 text-white">
    {/* Header Centrado */}
    <div className="bg-gray-800 border-b border-gray-700 py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center space-x-4">
            <Droplets className="text-blue-400 w-10 h-10" />
            <h1 className="text-3xl font-bold text-blue-400">
              Registro de Medición de Calidad del Agua
            </h1>
          </div>
          {/* <p className="text-gray-300 text-lg">
            Sistema de monitoreo y visualización de datos de calidad del agua
          </p> */}
        </div>
      </div>
    </div>

    {/* Contenido Principal */}
    <div className="container mx-auto px-6 py-8">
      {/* Sección del Mapa */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">
          📌  Mapa con marcadores en ubicaciones de muestras
        </h2>
        <p className="text-gray-400 mb-6">
          Haz clic en cualquier marcador para ver los detalles de la medición
        </p>
        
        {/* Mapa */}
        <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
          <LeafletMap points={points} onPointClick={handlePointClick} />
        </div>
      </div>

      {/* Panel de Información del Punto Seleccionado */}
      {selectedPoint && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl p-4">
            <h3 className="text-xl font-bold text-white text-center">
              ℹ️ Información Detallada del Punto Seleccionado
            </h3>
          </div>
          <div className="bg-gray-800 rounded-b-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna Izquierda */}
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-3 text-lg">📍 Ubicación</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Región:</span>
                      <span className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm">
                        {selectedPoint.region}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Comuna:</span>
                      <span className="bg-green-900 text-green-100 px-3 py-1 rounded-full text-sm">
                        {selectedPoint.comuna}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Dirección:</span>
                      <span className="text-gray-200 text-sm text-right">{selectedPoint.direccion}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-3 text-lg">📊 Datos de Medición</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Lectura PPM:</span>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                            selectedPoint.ppm <= 150 
                            ? 'bg-green-500 text-white' 
                            : selectedPoint.ppm > 150 && selectedPoint.ppm <= 300 
                            ? 'bg-blue-500 text-white' 
                            : selectedPoint.ppm > 300 && selectedPoint.ppm <= 600 
                            ? 'bg-yellow-500 text-black' 
                            : selectedPoint.ppm > 600 && selectedPoint.ppm <= 850 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                            {selectedPoint.ppm} PPM
                    </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Fecha de muestra:</span>
                      <span className="bg-purple-900 text-purple-100 px-3 py-1 rounded-full text-sm">
                        {selectedPoint.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
                     <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-3 text-lg">🌐 Coordenadas</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Latitud:</span>
                      <span className="bg-gray-600 text-gray-200 px-3 py-1 rounded text-sm font-mono">
                        {selectedPoint.location.latitude}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Longitud:</span>
                      <span className="bg-gray-600 text-gray-200 px-3 py-1 rounded text-sm font-mono">
                        {selectedPoint.location.longitude}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-3 text-lg">📝 Descripción</h4>
                  <p className="text-gray-200 text-sm bg-gray-600 p-3 rounded-lg">
                    {selectedPoint.descripcion}
                  </p>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="space-y-4">
                {/* Imagen */}
                {selectedPoint.images && selectedPoint.images.length > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-3 text-lg">📷 Imagen de Lectura</h4>
                    <div className="flex justify-center">
                      <img 
                        src={selectedPoint.images[0]} 
                        className="w-full max-w-md h-auto object-cover rounded-lg border-2 border-blue-500 shadow-lg"
                        alt="Imagen de la lectura de calidad del agua"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listado de Ubicaciones */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            📍 Listado de Ubicaciones de Toma de Muestras
          </h2>
          <p className="text-gray-400">
            {points.length} ubicaciones registradas - Haz clic para ver detalles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {points.map(point => (
            <div
              key={point.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedPoint?.id === point.id
                  ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/25'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-400 hover:bg-gray-600/50'
              }`}
              onClick={() => handlePointClick(point)}
            >
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-lg">Comuna: {point.comuna}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                    point.ppm <= 150 
                    ? 'bg-green-500 text-white' 
                    : point.ppm > 150 && point.ppm <= 300 
                    ? 'bg-blue-500 text-white' 
                    : point.ppm > 300 && point.ppm <= 600 
                    ? 'bg-yellow-500 text-black' 
                    : point.ppm > 600 && point.ppm <= 850 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                    {point.ppm} PPM
                </span>
            </div>

              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Región:</span>
                  <span className="text-white font-medium">{point.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dirección:</span>
                  <span className="text-white text-right text-xs">{point.direccion}</span>
                </div>
                <div className="pt-2 border-t border-gray-600">
                  <p className="text-xs text-gray-400 text-center">
                    📍 Lat: {point.location.latitude}, Lng: {point.location.longitude}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
          <div>
        <Footer />
      </div>
  </div>

);
};

export default MapaLocaciones;