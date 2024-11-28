'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
export default function Home() {
   const [links, setLinks] = useState([''])
   const [sets, setSets] = useState([''])
   const [currentSet, setCurrentSet] = useState('')
  useEffect(() => {
    fetch('sets.txt')
    .then((res)=>{return res.text()})
    .then((txt) => {
      var arr = txt.split('\r\n')
      arr.reverse()
      setSets(arr);
      setCurrentSet(arr[0])
    })
  }, [])

  useEffect(()=> {
    if(currentSet!='') {
      fetch(currentSet+'/results/content/contents.txt')
      .then((res) =>{return res.text()})
      .then((txt)=>{
        var arr = txt.split('\r\n')
        arr = arr.filter(n => n)
        setLinks(arr)
      })
    }
  },[currentSet])
  

/*
{links.map((link) => {
        return <a href={link.path + '/graphs'} key={link.path}   className="w-full block"><input type='button' value={link.path} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full"/></a>
      })}      
*/
  return (
    <div >
      <form className="max-w-sm mx-auto">
      <select defaultValue={currentSet} onChange={(ev)=>{setCurrentSet(ev.target.value)}} className="mx-auto my-2 block w-full bg-gray-50 border border-gray-300  text-gray-900 text-sm">  
            {sets.map((s) => {
              return <option key={s} value={s}>{s}</option>
            })}
        </select>
      </form>

        <div className="grid grid-cols-3 gap-4 m-2">
          {links.map((link) => {
            console.log(link)
            return <a href={currentSet + '/' + link + '/graphs'} key={link}   className="w-full block"><input type='button' value={link} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full"/></a>
          })}      
        </div>
        
    </div>
  );
}
