import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area,Label, AreaChart ,LabelList} from 'recharts';
import { collection, getDocs, query} from "firebase/firestore";
import { db } from '../firebase';
import Footer from '../components/Footer';


// Función para procesar datos de Firebase
const processFirebaseData = (firebaseDocuments) => {
  // Agrupar por comuna
  const groupedByComuna = {};
  const groupedByDireccion = {};
  const timeSeriesData = {};

  firebaseDocuments.forEach(doc => {
    const comuna = doc.comuna || 'Sin comuna';
    const direccion = doc.direccion || 'Sin dirección';
    const ppm = doc.ppm || 0;
    const createdAt = doc.createdAt;

    // Agrupar por comuna
    if (!groupedByComuna[comuna]) {
      groupedByComuna[comuna] = { total: 0, count: 0 };
    }
    groupedByComuna[comuna].total += ppm;
    groupedByComuna[comuna].count += 1;

    // Agrupar por dirección
    if (!groupedByDireccion[direccion]) {
      groupedByDireccion[direccion] = { comunas: {}, total: 0 };
    }
    if (!groupedByDireccion[direccion].comunas[comuna]) {
      groupedByDireccion[direccion].comunas[comuna] = 0;
    }
    groupedByDireccion[direccion].comunas[comuna] += ppm;
    groupedByDireccion[direccion].total += ppm;

    // Serie temporal (últimos 7 días)
    if (createdAt) {
      const date = new Date(createdAt);
      const dayKey = date.toLocaleDateString('es-ES', { weekday: 'short' });
      
      if (!timeSeriesData[dayKey]) {
        timeSeriesData[dayKey] = {};
      }
      if (!timeSeriesData[dayKey][comuna]) {
        timeSeriesData[dayKey][comuna] = [];
      }
      timeSeriesData[dayKey][comuna].push(ppm);
    }
  });

  // Preparar datos para gráfico de líneas
  const lineData = Object.keys(timeSeriesData).map(day => {
    const dayData = { day };
    Object.keys(timeSeriesData[day]).forEach(comuna => {
      const values = timeSeriesData[day][comuna];
      dayData[comuna] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    });
    return dayData;
  });

  // Preparar datos para gráfico de dona
  const colors = ['#3B82F6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];
  const donutData = Object.keys(groupedByComuna).map((comuna, index) => ({
    name: comuna,
    value: groupedByComuna[comuna].total,
    color: colors[index % colors.length]
  }));

  // Preparar datos para gráfico de barras
  // Tomar las top 10 direcciones con más mediciones
  const sortedDirecciones = Object.entries(groupedByDireccion)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 12);
  
  const barData = sortedDirecciones.map(([direccion, data]) => {
    const shortDireccion = direccion.length > 20 ? direccion.substring(0, 20) + '...' : direccion;
    const barEntry = { direccion: shortDireccion, Direccion: direccion };
    
    // Agregar cada comuna como una propiedad
    Object.keys(data.comunas).forEach(comuna => {
      barEntry[comuna] = Math.round(data.comunas[comuna]);
    });
    
    return barEntry;
  });

  // Calcular estadísticas
  const allPPMs = firebaseDocuments.map(doc => doc.ppm || 0);
  const avgPPM = Math.round(allPPMs.reduce((a, b) => a + b, 0) / allPPMs.length);
  const maxPPM = Math.max(...allPPMs);
  const totalLocations = new Set(firebaseDocuments.map(doc => doc.direccion)).size;

  return { lineData, donutData, barData, avgPPM, maxPPM, totalLocations };
};

const Grafico = () => {

  const [chartData, setChartData] = useState({
    lineData: [],
    donutData: [],
    barData: [],
    avgPPM: 0,
    maxPPM: 0,
    totalLocations: 0
  });
  const [tar, setTar] = React.useState([]);
  const [loading, setLoading] = useState(true);


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

        useEffect(() => {
            // // Aquí conectarías con Firebase
            // // Ejemplo de cómo cargar los datos:
            const loadFirebaseData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Locaciones'));
                const documents = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
            }));


        const processed = processFirebaseData(documents);
        setChartData(processed);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadFirebaseData();
   }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando datos...</div>
      </div>
    );
  }

  const { lineData, donutData, barData, avgPPM, maxPPM, totalLocations } = chartData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value} ppm</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const DonutLabel = ({ viewBox, value1, value2 }) => {
    const { cx, cy } = viewBox;
    return (
      <text x={cx} y={cy} textAnchor="middle">
        <tspan x={cx} y={cy - 10} className="text-3xl font-bold fill-white">
          {value1}
        </tspan>
        <tspan x={cx} y={cy + 20} className="text-sm fill-slate-400">
          {value2}
        </tspan>
      </text>
    );
  };

  const totalPPM = donutData.reduce((acc, curr) => acc + curr.value, 0);

  // Obtener todas las comunas únicas para los colores consistentes
    const allComunas = [...new Set([
        ...lineData.flatMap(d => Object.keys(d).filter(k => k !== 'day')),
        ...barData.flatMap(d => Object.keys(d).filter(k => k !== 'direccion'))
    ])];
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6', '#F97316'];
    const comunaColors = {};
    allComunas.forEach((comuna, index) => {
        comunaColors[comuna] = colors[index % colors.length];
    });

    //datos de nuevo chart lineal
const CustomTooltips = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-4 shadow-2xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-300 text-sm">
                {entry.name}: <span className="font-bold text-white">{entry.value} ppm</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

// Dot personalizado
  const CustomDot = (props) => {
    const { cx, cy, stroke, value } = props;
    
    return (
      <g>
        {/* Círculo exterior con glow */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={8} 
          fill={stroke} 
          opacity={0.2}
        />
        {/* Círculo principal */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={5} 
          fill="#1e293b"
          stroke={stroke}
          strokeWidth={3}
        />
        {/* Punto central */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={2} 
          fill={stroke}
        />
      </g>
    );
  };

  // Active Dot (cuando pasas el mouse)
  const CustomActiveDot = (props) => {
    const { cx, cy, stroke } = props;
    
    return (
      <g>
        {/* Anillo animado exterior */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={12} 
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          opacity={0.3}
        />
        {/* Círculo principal más grande */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={7} 
          fill="#1e293b"
          stroke={stroke}
          strokeWidth={3}
        />
        {/* Punto central brillante */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={3} 
          fill={stroke}
        />
      </g>
    );
  };
    ///

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard de Mediciones PPM</h1>
          <p className="text-slate-400">Análisis de contaminación por comuna y localización</p>
        </div>
            
            {/* Gráfico de Líneas */}
         <div className="min-h-screen bg-slate-900 p-6 bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                <h2 className="text-xl font-semibold text-white mb-1">Gráfico con todas las muestras</h2>
                <p className="text-slate-400 text-sm">Mide los PPM de cada muestra</p>
                </div>
            </div> 
            <ResponsiveContainer width="100%" aspect={2}>
            {/* <LineChart 
                data={tar} 
                //width={600} 
               // height={400}
                    margin={
                    { 
                        top:10,
                        right:10,
                        left:20,
                        bottom:25
                    }}
            >
                    <XAxis name="Región" dataKey="region"  > 
                        <Label value="Región y comuna de toma de muestras" offset={-20} position="insideBottom" stroke="#6DA6DF" />
                    </XAxis> 
                    <YAxis type="number" label={{ value: 'PPM Muestra', angle: -90, position: 'insideLeft', stroke:"#6DA6DF" }} domain={[0,1100]} allowDataOverflow/>
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line name="Comuna" type="monotone" dataKey="comuna" stroke="#E1600C" activeDot={{r: 10}} >
                    </Line>
                    <Line name="PPM" type="monotone" dataKey="ppm" stroke="#6DA6DF" />
                </LineChart> */}
                <LineChart
              data={tar}
              margin={{
                top: 10,
                right: 10,
                left: 20,
                bottom: 25
              }}
            >
              {/* Grid con estilo mejorado */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#334155" 
                strokeOpacity={0.3}
                vertical={false}
              />
              
              {/* Eje X mejorado */}
              <XAxis 
                name="Región" 
                dataKey="region"
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                tickLine={{ stroke: '#475569' }}
                axisLine={{ stroke: '#475569' }}
              >
                {/* Label personalizado */}
                <text
                  x="50%"
                  y="100%"
                  dy={20}
                  textAnchor="middle"
                  fill="#6DA6DF"
                  fontSize={14}
                  fontWeight={600}
                >
                  Región y comuna de toma de muestras
                </text>
              </XAxis>
              
              {/* Eje Y mejorado */}
              <YAxis 
                type="number" 
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                tickLine={{ stroke: '#475569' }}
                axisLine={{ stroke: '#475569' }}
                domain={[0, 1100]} 
                allowDataOverflow
                label={{ 
                  value: 'PPM Muestra', 
                  angle: -90, 
                  position: 'insideLeft', 
                  stroke: "#6DA6DF",
                  fill: "#6DA6DF",
                  fontSize: 14,
                  fontWeight: 600
                }}
              />
              
              {/* Tooltip mejorado */}
              <Tooltip 
                content={<CustomTooltips />}
                cursor={{ 
                  stroke: '#475569', 
                  strokeWidth: 2,
                  strokeDasharray: '5 5'
                }}
              />
              
              {/* Legend mejorada */}
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ 
                  paddingBottom: '20px',
                  fontSize: '14px',
                  fontWeight: 600
                }}
                iconType="circle"
                iconSize={10}
              />
              
              {/* Línea de Comuna - MUCHO MÁS GRUESA */}
              <Line 
                name="Comuna" 
                type="monotone" 
                dataKey="comuna" 
                stroke="#E1600C" 
                strokeWidth={5}
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Línea de PPM - MUCHO MÁS GRUESA */}
              <Line 
                name="PPM" 
                type="monotone" 
                dataKey="ppm" 
                stroke="#6DA6DF" 
                strokeWidth={5}
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </LineChart>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Resumen de todas las muestras analizadas</h1>
                        <p className="text-slate-400">Acá se encuentra un resumen de todas las toma de muestras realizadas.
                                En cada nodo se encuentra información adicional respecto a la región, comuna los PPM de la muestra 
                        </p>
                <br></br>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Promedio General</p>
                        <p className="text-3xl font-bold text-white">{avgPPM} ppm</p>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Mayor Medición</p>
                        <p className="text-3xl font-bold text-white">{maxPPM} ppm</p>
                    </div>
                    <div className="bg-red-500/20 p-3 rounded-lg">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                    </div>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm mb-1">Mínimo</p>
                        <p className="text-3xl font-bold text-white">{Math.min(...tar.map(d => d.ppm))} PPM</p>
                    </div>
                    <div className="bg-emerald-500/20 p-3 rounded-lg">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    </div>
                </div>
        </div>
     </div>
                <div>
                    
                </div>
            </ResponsiveContainer>
    {/* Stats Cards debajo del gráfico */}
        </div> 
        {/* Grid de Gráficos */}
        <div className="grid grid-cols-0 lg:grid-cols-0 gap-6">
          {/* Gráfico de Dona */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">Distribución por Comuna</h2>
              <p className="text-slate-400 text-sm">Total de mediciones acumuladas</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value} ppm`}
                  labelLine={{ stroke: '#64748B' }}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-white">
                  {totalPPM} ppm
                </text>
                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-slate-400">
                  Total mediciones
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
         </div>
   
          {/* Gráfico de Barras */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">Comparación por Locación</h2>
              <p className="text-slate-400 text-sm">Suma de PPM por tipo de lugar</p>
            </div>
            <ResponsiveContainer width="100%" height={520}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="direccion" stroke="#94A3B8" angle={-45} textAnchor="end" height={120} interval={0} tick={{fill: '#94A3B8', fontSize:11}}/>
                <YAxis stroke="#94A3B8" label={{ value: 'ppm', angle: -90, position: 'insideLeft', fill: '#94A3B8' }} tick={{fill: '#94A3B8'}}/>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#E2E8F0' }} iconType="rect" iconSize={10}/>
                {allComunas.slice(0, 10).map((comuna) => (
                  <Bar 
                    key={comuna}
                    dataKey={comuna} 
                    fill={comunaColors[comuna]} 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={60}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>
      <Footer />
    </div>
  );
};



export default Grafico;