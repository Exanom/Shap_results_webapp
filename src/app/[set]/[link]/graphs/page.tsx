'use client'

import { useEffect, useState } from "react";
import Papa from 'papaparse';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{link : string, set: string}>()
  const [link,setLink] = useState('')
  const [resultsSrc, setResultSrc] = useState('all_results.png')
  const [imgs, setImgs] = useState([''])
  const [data, setData] = useState([undefined])
  const [showMetrics, setShowMetrics] = useState(false)
  const [showNormalized, setShowNormalized] = useState(true)
  const [showShaps, setShowShaps] = useState(true)
  const [showImg,setShowImg] = useState(false)
  

  const path = '/' + params.set + '/results/content/'
  useEffect(() => {
    setLink(decodeURI(params.link))
    const match = decodeURI(params.link).match(/\[(\d+)\]/);
    if(match) {
      var tmp = []
      for(let i=1; i<=parseInt(match[1]);i++) {
        tmp.push('T_' + i.toString() +'.png');
      }
      setImgs(tmp);
    }

    fetch(path+decodeURI(params.link)+'/results.csv')
    .then((data) => {return data.text()})
    .then((res)=>{
      Papa.parse(res, {
        header:true,
        skipEmptyLines:true,
        complete: (csv)=>{
          console.log(csv)
          let arr: any[] = csv.data;
          for(let i=0;i<arr.length;i++) {
            if(i==0) {
              arr[i]['img'] = path + decodeURI(params.link) + '/INITIAL.png';
            }
            else {
              arr[i]['img'] = path + decodeURI(params.link) + '/T_'+i.toString()+'.png'
            }
          }
          setData(arr)
        }
      })
      
    })
    
  }, [])  
 
  const CustomTooltip = ({active,payload} : any) => {
    if(active && payload && payload.length) {
      const {img} = payload[0].payload;
      return (
        <div>
          <img src={img} className="h-auto w-80"/> 
        </div>
      )
    }
    return null;
  }

  return (
      <div>
        <a href="/">
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2">Home Page</button>
            
        </a>
        <a href={path+link+'/results.csv'}>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2">Download results in CSV</button>
            
        </a>
        <a href={path+link+'/data.pkl'}>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2">Download training data in pickle(.pkl) format</button>
            
        </a>
        <div>
            <button onClick={()=>{setResultSrc('all_results.png')}} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2">All results</button>
            <button onClick={()=>{setResultSrc('shap_results.png')}}  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2">Shap results</button>
            <button onClick={()=>{setResultSrc('')}}  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2">Interactive</button>
            {(resultsSrc != '' || data.length==0) ?
            (<img src={ path + link +'/' + resultsSrc} />):
            (
              <div>
                <div className="flex flex-row gap-4 my-2 mx-10">
                  <div>
                  <input type="checkbox" id="shaps" defaultChecked={showShaps} onChange={(ev)=>{setShowShaps(ev.target.checked)}} />
                  <label htmlFor="shaps">Mean shap values</label>
                  </div>
                  <div>
                  <input type="checkbox" id="metrics" defaultChecked={showMetrics} onChange={(ev)=>{setShowMetrics(ev.target.checked)}}/>
                  <label htmlFor="metrics">Metrics</label>
                  </div>
                  <div>
                  <input type="checkbox" id="classes" defaultChecked={showNormalized} onChange={(ev)=>{setShowNormalized(ev.target.checked)}}/>
                  <label htmlFor="classes">Normalized shaps</label>
                  </div>
                  <div>
                  <input type="checkbox" id="hover" defaultChecked={showImg} onChange={(ev)=>{setShowImg(ev.target.checked)}}/>
                  <label htmlFor="hover">Hover images</label>
                  </div>
                </div>
                
                
                
                
                
      
                <LineChart width={800} height={400} data={data} margin={{top:20, right:30, left:20, bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="" />
                    {showNormalized?<YAxis domain={[-2.7,2.7]}/>:<YAxis/>}
                    
                    {showImg
                    ?(<Tooltip content={<CustomTooltip/>}/>)
                    :(<Tooltip/>)}
                    
                    {showMetrics?(<Line type="monotone" dataKey="accuracy"  stroke="gray" />):(<span></span>)}
                    {showMetrics?(<Line type="monotone" dataKey="precision"  stroke="gray" />):(<span></span>)}
                    {showShaps?(<Line type="monotone" dataKey="X"  stroke="green" />):(<span></span>)}
                    {showShaps?(<Line type="monotone" dataKey="Y"  stroke="red" />):(<span></span>)}
                    {showNormalized?(<Line type="monotone" dataKey="X_Class1"  stroke="cyan" />):(<span></span>)}
                    {showNormalized?(<Line type="monotone" dataKey="X_Class2"  stroke="chartreuse" />):(<span></span>)}
                    {showNormalized?(<Line type="monotone" dataKey="Y_Class1"  stroke="purple" />):(<span></span>)}
                    {showNormalized?(<Line type="monotone" dataKey="Y_Class2"  stroke="orange" />):(<span></span>)}
                    
                    
                    <Legend  verticalAlign="top"/>
                    
                </LineChart>
              </div>
              
            )}
            
        </div>
        <div>
          <h1 className="text-xl text-center font-bold">Initial</h1>
          <img className="m-auto" src={path+link+'/INITIAL.png'} />
         
          </div>
        <div className="grid grid-cols-4 gap-4">
          
          
        {
        imgs.map((img) => {
          return <div key={img}><h1 className="text-xl text-center font-bold">{img}</h1><img src={path+link+'/'+img} /></div>
        })
      }
        </div>
      </div>
  );
}
