"use client";

import Image from "next/image";
import { useState } from "react";
import type { Character } from "@/config/characters";

export default function CardImage({ character }: { character: Character }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${character.accentColor}30, transparent)` }}
      >
        <span
          className="font-bold text-7xl opacity-20"
          style={{ color: character.accentColor }}
        >
          {character.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={character.avatar}
      alt={character.name}
      fill
      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
      onError={() => setError(true)}
    />
  );
}
