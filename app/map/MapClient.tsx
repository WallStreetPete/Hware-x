"use client";
import dynamic from "next/dynamic";
const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });
export default function MapClient() { return <WorldMap />; }
