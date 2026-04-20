"use client";

import Image from "next/image";
import { useState } from "react";
import type { Character } from "@/config/characters";

interface Props {
  character: Character;
  size?: number;
  className?: string;
}

export default function CharacterAvatar({ character, size = 32, className = "" }: Props) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${character.accentColor}80, ${character.accentColor}40)`,
          border: `1px solid ${character.accentColor}40`,
          fontSize: size * 0.38,
        }}
      >
        {character.name.charAt(0)}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-white/10 shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={character.avatar}
        alt={character.name}
        fill
        className="object-cover object-top"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
