import { notFound } from "next/navigation";
import { getCharacterById } from "@/config/characters";
import ChatClient from "./ChatClient";

interface Props {
  params: Promise<{ characterId: string }>;
}

export default async function ChatPage({ params }: Props) {
  const { characterId } = await params;
  const character = getCharacterById(characterId);

  if (!character) {
    notFound();
  }

  return <ChatClient character={character} />;
}
