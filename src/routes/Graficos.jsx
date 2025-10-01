import React, { useEffect, PureComponent } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, LineChart,Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Label, LabelList } from 'recharts';
import { collection, getDocs, query, doc, getDoc, addDoc, deleteDoc, updateDoc, setDoc, where, QuerySnapshot, orderBy } from "firebase/firestore";
import { db } from '../firebase';

const Graficos = () => {

    const [tar, setTar] = React.useState([]);
    const [reg, setReg] = React.useState([]);
    const [xreg, setXReg] = React.useState([]);
    const [vireg, setViReg] = React.useState([]);
  

    useEffect(() => {
        const obtenerDatosAgua = async () => {
            try {
                const dataRef = collection(db, 'Locaciones');
                const querySnapshot = await getDocs(query(dataRef));
                const dataDB = querySnapshot.docs.map((doc) => doc.data());
                setTar(dataDB)
                console.log(dataDB);
               } catch (error) {
               console.log(error)
             }
          }
          obtenerDatosAgua()
    }, []);

    useEffect(() => {
        const obtenerDatosAguaReg = async () => {
            try {
                const q = query(collection(db, 'Locaciones'), where('region', '==', 'Metropolitana'));
                const querySnapshot = await getDocs(q);
                const datosReg = querySnapshot.docs.map((doc) => doc.data());
                setReg(datosReg);
                console.log(datosReg);
               } catch (error) {
               console.log(error)
             }
          }
          obtenerDatosAguaReg()
    }, []);

    useEffect(() => {
        const obtenerDatosAguaXReg = async () => {
            try {
                const q = query(collection(db, 'Locaciones'), where('region','==', 'X Región de Los Lagos'));
                const querySnapshot = await getDocs(q);
                const datosXReg = querySnapshot.docs.map((doc) => doc.data());
                setXReg(datosXReg);
                console.log(datosXReg);
               } 
               catch (error) {
               console.log(error)
             }
          }
          obtenerDatosAguaXReg()
    }, []);
  
    useEffect(() => {
        const obtenerDatosAguaViReg = async () => {
            try {
                const q = query(collection(db, 'Locaciones'), where('region','==', 'VI Región del Maule'));
                const querySnapshot = await getDocs(q);
                const datosViReg = querySnapshot.docs.map((doc) => doc.data());
                setViReg(datosViReg);
                console.log(datosViReg);
               } 
               catch (error) {
               console.log(error)
             }
          }
          obtenerDatosAguaViReg()
    }, []);

    class CustomizedAxisTick extends PureComponent {
        render() {
          const { x, y, stroke, payload } = this.props;
          //</LineChart> tick={<CustomizedAxisTick />}
          return (
            <g transform={`translate(${x},${y})`}>
              <text x={0} y={0} dy={5} textAnchor="end" fill="#666" transform="rotate(-50)">
                {payload.value}
              </text>
            </g>
          );
        }
      }


  return (
    <div>
  <br></br>
     <br></br>
     <br></br>
     <br></br>
     <h2 className="font-weight-light" style={{color: "white"}}>Gráfico lineal de resultados de toma de muestras</h2>
     <hr/>   
    <ResponsiveContainer width="100%" aspect={2}>
        <LineChart 
            data={tar} 
            width={600} 
            height={400}
            margin={
                { 
                    top:10,
                    right:10,
                    left:20,
                    bottom:25
                }}
        >
        <CartesianGrid strokeDasharray="3 3"/>
            <XAxis name="Región" dataKey="region"  > 
                <Label value="Región y comuna de toma de muestras" offset={-20} position="insideBottom" stroke="#6DA6DF" />
                
            </XAxis> 
            <YAxis type="number" label={{ value: 'PPM Muestra', angle: -90, position: 'insideLeft', stroke:"#6DA6DF" }} domain={[0,1100]} allowDataOverflow/>
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line name="Comuna" type="monotone" dataKey="comuna" stroke="#E1600C" activeDot={{r: 10}} >
            </Line>
            <Line name="PPM" type="monotone" dataKey="ppm" stroke="#6DA6DF" />
        </LineChart>
    </ResponsiveContainer>
     <br></br>
     <br></br>
     <br></br>
     <h2 className="font-weight-light" style={{color: "white"}}>Gráfico lineal de resultados de toma de muestras en Región Metropolitana</h2>
     <hr/>   
    <ResponsiveContainer width="100%" aspect={2}>
        <LineChart 
            data={reg} 
            width={600} 
            height={400}
            margin={
                { 
                    top:1,
                    right:10,
                    left:20,
                    bottom:20
                }}
        >
        <CartesianGrid strokeDasharray="3 3"/>
            <XAxis name="Comuna" dataKey="comuna" height={30} domain={[0,100]} allowDataOverflow includeHidden>
                <Label value="Comuna muestras" offset={-20} position="insideBottom" stroke="#6DA6DF"/>
            </XAxis> 
            <YAxis type='number' label={{ value: 'PPM Muestra', angle: -90, position: 'insideLeft', stroke:"#6DA6DF" }} domain={[0,1200]} allowDataOverflow />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line name="Comuna" type="monotone" dataKey="comuna" stroke="#E1600C" activeDot={{r: 10}} >
            </Line>
            <Line name="PPM" type="monotone" dataKey="ppm" stroke="#6DA6DF" />
            <Line name="Dirección" type="monotone" dataKey="direccion" stroke="#6DA6DF" />
            <Line name="Desc" type="monotone" dataKey="descripcion" stroke="#6DA6DF" />
        </LineChart>
    </ResponsiveContainer>

     <br></br>
     <br></br>
 
     <h2 className="font-weight-light" style={{color: "white"}}>Gráfico lineal de resultados de toma de muestras en X Región de Los Lagos</h2>
     <hr/>   
    <ResponsiveContainer width="100%" aspect={2}>
        <LineChart 
            data={xreg} 
            width={600} 
            height={400}
            margin={
                { 
                    top:1,
                    right:10,
                    left:20,
                    bottom:25
                }}
        >
        <CartesianGrid strokeDasharray="3 3"/>
            <XAxis name="Comuna" dataKey="comuna" height={30} domain={[0,100]} allowDataOverflow includeHidden>
                <Label value="Comuna muestras" offset={-20} position="insideBottom" stroke="#6DA6DF"/>
            </XAxis> 
            <YAxis type='number' label={{ value: 'PPM Muestra', angle: -90, position: 'insideLeft', stroke:"#6DA6DF" }} domain={[0,150]} allowDataOverflow />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line name="Comuna" type="monotone" dataKey="comuna" stroke="#E1600C" activeDot={{r: 10}} >
            </Line>
            <Line name="PPM" type="monotone" dataKey="ppm" stroke="#6DA6DF" />
            <Line name="Dirección" type="monotone" dataKey="direccion" stroke="#6DA6DF" />
            <Line name="Desc" type="monotone" dataKey="descripcion" stroke="#6DA6DF" />
        </LineChart>
    </ResponsiveContainer>


     <br></br>
     <br></br>
     <br></br>
     <h2 className="font-weight-light" style={{color: "white"}}>Gráfico lineal de resultados de toma de muestras en VI Región del Maule </h2>
     <hr/>   
    <ResponsiveContainer width="100%" aspect={2}>
        <LineChart 
            data={vireg} 
            width={600} 
            height={400}
            margin={
                { 
                    top:1,
                    right:10,
                    left:20,
                    bottom:25
                }}
        >
        <CartesianGrid strokeDasharray="3 3"/>
            <XAxis name="Comuna" dataKey="comuna" height={30} domain={[0,100]} allowDataOverflow includeHidden>
                <Label value="Comuna muestras" offset={-20} position="insideBottom" stroke="#6DA6DF"/>
            </XAxis> 
            <YAxis type='number' label={{ value: 'PPM Muestra', angle: -90, position: 'insideLeft', stroke:"#6DA6DF" }} domain={[0,450]} allowDataOverflow />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line name="Comuna" type="monotone" dataKey="comuna" stroke="#E1600C" activeDot={{r: 10}} >
            </Line>
            <Line name="PPM" type="monotone" dataKey="ppm" stroke="#6DA6DF" />
            <Line name="Dirección" type="monotone" dataKey="direccion" stroke="#6DA6DF" />
            <Line name="Desc" type="monotone" dataKey="descripcion" stroke="#6DA6DF" />
        </LineChart>
    </ResponsiveContainer>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    </div>
  )
}
//<Bar dataKey="comuna" fill="#E1600C"/>
//<Bar dataKey="ppm" fill="#6DA6DF"/>
export default Graficos;