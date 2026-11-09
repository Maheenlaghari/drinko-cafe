"use client";

import React from "react";
import Image from "next/image";
import { heroData } from "@/data/menu-data";

export function HeroSection() {
  return (
    <section className="hero-section relative w-full overflow-hidden bg-white">
      <div className="hero-inner relative mx-auto h-full w-full">
        <div className="hero-copy absolute z-10">
          <span className="hero-welcome hero-copy-welcome font-drinko block font-bold uppercase">
            {heroData.titlePrefix}
          </span>
          <h1 className="hero-title hero-copy-title m-0 font-medium uppercase tracking-widest">
            {heroData.titleHighlight}
          </h1>
          <p className="hero-description hero-copy-description m-0 font-normal">
            <span className="block">{heroData.descriptionLine1}</span>
            <span className="block">{heroData.descriptionLine2}</span>
          </p>
        </div>
        <Image
          src={heroData.image}
          alt={heroData.imageAlt}
          width={1024}
          height={1024}
          priority
          sizes="(max-width: 640px) 100vw, 56vw"
          className="hero-image pointer-events-none absolute select-none object-contain"
        />
      </div>
    </section>
  );
}
