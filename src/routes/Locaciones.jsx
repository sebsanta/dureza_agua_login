import React, { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';
import { collection, getDocs, query} from "firebase/firestore";
import { db } from '../firebase';
import Footer from '../components/Footer';

const Locaciones = () => {
  // Datos de ejemplo basados en tu estructura de Firebase
//   const [data, setData] = useState([
//     {
//       id: "2zPwKXs2ThUBfxThzB3d",
//       comuna: "Chépica",
//       createdAt: "17 de junio de 2022, 12:35:55 a.m. UTC-4",
//       descripcion: "APR agua potable rural",
//       direccion: "Puente Cabrerio",
//       ppm: 243,
//       region: "VI Región del Maule",
//       date: "6/17/2022"
//     },
//     {
//       id: "45c9fc87-a599-46c8-91cf",
//       comuna: "San Miguel",
//       descripcion: "Se toma muestra de agua potable de la llave en recipiente de vidrio a una temperatura de 16°C",
//       direccion: "Cuarta avenida 1227",
//       ppm: 527,
//       region: "Metropolitana",
//       date: "8/20/2024"
//     },
//     {
//       id: "5f0caa25-68f4-4958-9318",
//       comuna: "Providencia",
//       descripcion: "Se toma muestra de agua potable de oficinas en edificio costanera center",
//       direccion: "Av Tobalaba",
//       ppm: 510,
//       region: "Metropolitana",
//       date: "10/3/2024"
//     },
//     {
//       id: "8f567e8-44a1-42b1-a213",
//       comuna: "Curanipe",
//       descripcion: "Se toma muestra de agua de vertiente del sector",
//       direccion: "Camino rural",
//       ppm: 120,
//       region: "VI Región del Maule",
//       date: "10/31/2024"
//     },
//     {
//       id: "AM8VLJPtUGHtJV7tS6P",
//       comuna: "Maipú",
//       descripcion: "Agua de grifo de baño",
//       direccion: "Hidumea 3276",
//       ppm: 558,
//       region: "Metropolitana",
//       date: "4/11/2022"
//     },
//     {
//       id: "BndF2WFAQVC0MutufBD7",
//       comuna: "Molina, Itahue",
//       descripcion: "Se toma muestra del humedal de la zona",
//       direccion: "KM-210 ruta 170",
//       ppm: 130,
//       region: "VI Región del Maule",
//       date: "12/3/2022"
//     },
//     {
//       id: "DAA1A2tHMmJBMJPx40n1",
//       comuna: "El Quisco",
//       descripcion: "Se toma muestra de agua potable domiciliaria",
//       direccion: "Cerrillos",
//       ppm: 792,
//       region: "IV Región de Valparaíso",
//       date: "1/22/2022"
//     },
//     {
//       id: "DpCMhSqNIEvORVWKtxRc",
//       comuna: "Los Molles",
//       descripcion: "Se toma muestra desde el agua potable domiciliaria. Lavaplatos del comedor. Los ppm registrados son...",
//       direccion: "Circulación del Día 50, Los Molles",
//       ppm: 390,
//       region: "IV Región de Valparaíso",
//       date: "3/24/2021"
//     },
//     {
//       id: "J207dENeEn8mAK59REjS",
//       comuna: "Ñuñoa",
//       descripcion: "Agua potable condominio",
//       direccion: "José Pedro Alessandri 1620",
//       ppm: 293,
//       region: "Metropolitana",
//       date: "12/9/2022"
//     }
//   ]);

    const [filtro, setFiltro] = useState('Todas');
    const [tar, setTar] = React.useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterPPM, setFilterPPM] = useState('all');

    useEffect(() => {
    const obtenerDatosAgua = async () => {
        try {
            const dataRef = collection(db, 'Locaciones');
            const querySnapshot = await getDocs(query(dataRef));
            const dataDB = querySnapshot.docs.map((doc) => doc.data());
            setTar(dataDB)
           } catch (error) {
           console.log(error)
         };
      };
      obtenerDatosAgua()
}, [])

    // Función para ordenar
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

    // Función para filtrar y ordenar datos
    const getProcessedData = () => {
    let filteredData = [...tar];

    // Filtrar por rango de PPM
    if (filterPPM !== 'all') {
      filteredData = filteredData.filter(item => {
        const ppm = parseInt(item.ppm);
        switch (filterPPM) {
          case 'excellent': return ppm <= 150;
          case 'good': return ppm > 150 && ppm <= 300;
          case 'acceptable': return ppm > 300 && ppm <= 600;
          case 'problem': return ppm > 600 && ppm <= 850;
          case 'critical': return ppm > 850;
          default: return true;
        }
      });
    }

    // Ordenar
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === 'ppm') {
          aValue = parseInt(aValue);
          bValue = parseInt(bValue);
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filteredData;
  };
  
  const processedData = getProcessedData();

  //tailwind
  // Función para clasificar según PPM
  const getClassification = (ppm) => {
    if (ppm <= 150) return { type: 'Excelente', color: 'bg-green-500', textColor: 'text-green-700' };
    if (ppm <= 300) return { type: 'Buena', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (ppm <= 600) return { type: 'Aceptable', color: 'bg-orange-500', textColor: 'text-orange-700' };
    if (ppm <= 805) return { type: 'Problemática', color: 'bg-pink-500', textColor: 'text-pink-700' };
    return { type: 'Crítica', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  // Calcular estadísticas
  const stats = {
    total: tar.length,
    excelente: tar.filter(item => item.ppm <= 150).length,
    buena: tar.filter(item => item.ppm > 150 && item.ppm <= 300).length,
    aceptable: tar.filter(item => item.ppm > 300 && item.ppm <= 600).length,
    problematica: tar.filter(item => item.ppm > 600 && item.ppm <= 805).length,
    critica: tar.filter(item => item.ppm > 805).length
  };

  // Filtrar datos según el filtro seleccionado
  const filteredData = filtro === 'Todas' ? tar : tar.filter(item => {
    const classification = getClassification(item.ppm);
    return classification.type === filtro;
  });

  return (
    <div>
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Droplets className="text-blue-400 w-8 h-8" />
          <h1 className="text-2xl font-bold text-blue-400">Registro de Medición de Calidad del Agua </h1>
        </div>
        
        <div className="flex space-x-4">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-lg">
            Total: {stats.total} registros
          </div>
          <div className="bg-white text-gray-800 px-4 py-2 rounded-lg">
            💧 {stats.excelente} Excelentes
          </div>
        </div>
      </div>

      {/* Clasificación y Filtro */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 text-sm">
          <span>Clasificación:</span>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>≤150 (Excelente)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span>151-300 (Buena)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span>301-600 (Aceptable)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-pink-500 rounded-full"></span>
            <span>601-805 (Problemática)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>851 (Crítica)</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span>Filtrar:</span>
          <select 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
          >
            <option value="Todas">Todas</option>
            <option value="Excelente">Excelente</option>
            <option value="Buena">Buena</option>
            <option value="Aceptable">Aceptable</option>
            <option value="Problemática">Problemática</option>
            <option value="Crítica">Crítica</option>
          </select>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-400">{stats.excelente}</div>
          <div className="text-green-300 font-semibold">Excelente</div>
          <div className="text-gray-400 text-sm">≤150 PPM</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.buena}</div>
          <div className="text-blue-300 font-semibold">Buena</div>
          <div className="text-gray-400 text-sm">151-300 PPM</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-orange-400">{stats.aceptable}</div>
          <div className="text-orange-300 font-semibold">Aceptable</div>
          <div className="text-gray-400 text-sm">301-600 PPM</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-pink-400">{stats.problematica}</div>
          <div className="text-pink-300 font-semibold">Problemática</div>
          <div className="text-gray-400 text-sm">601-850 PPM</div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-red-400">{stats.critica}</div>
          <div className="text-red-300 font-semibold">Crítica</div>
          <div className="text-gray-400 text-sm">851 PPM</div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300">Región</th>
              <th className="text-left p-4 text-gray-300">Comuna</th>
              <th className="text-left p-4 text-gray-300">Dirección</th>
              <th className="text-left p-4 text-gray-300">Descripción</th>
              <th className="text-left p-4 text-gray-300">Dureza (PPM)</th>
              <th className="text-left p-4 text-gray-300">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => {
              const classification = getClassification(item.ppm);
              return (
                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4">{item.region}</td>
                  <td className="p-4">{item.comuna}</td>
                  <td className="p-4">{item.direccion}</td>
                  <td className="p-4 max-w-xs truncate">{item.descripcion}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${classification.color}`}>
                        {item.ppm} PPM
                      </span>
                      <span className={`text-sm font-medium ${classification.textColor.replace('text-', 'text-')}`}>
                        {classification.type}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{new Date(item.createdAt.seconds * 1000).toLocaleDateString("en-US",{dateStyle:"medium"})}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No se encontraron registros con el filtro seleccionado.
        </div>
      )}
      <div>
        <Footer />
      </div>
    </div>
        <div>
            
        </div>
    </div>
  );
};

export default Locaciones;