"use client";
import React from "react";

export default function PageRest({ onWakeUp }) {
    return (
        <div 
            className="flex items-center justify-center h-screen  text-white text-xl cursor-pointer"
            onClick={onWakeUp}
            style={{backgroundImage: "url('/img/fundo_descanso.png')", backgroundSize: 'cover'}} 
        >
           
        </div>
    );
}
