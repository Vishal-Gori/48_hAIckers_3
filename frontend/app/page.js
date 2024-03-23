"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState(null);
  const fetchData = async() => {
    debugger;
      const res = await fetch('http://localhost:5000/api/home');
      const mess = await res.json();
      setData(mess.message);
    }
  useEffect(() => {
      fetchData();
  }, [])
  
  return (
    <h1>{data}</h1>
  );
}

