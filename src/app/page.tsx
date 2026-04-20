import Link from "next/link";
import { characters } from "@/config/characters";
import CardImage from "@/components/CardImage";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="pt-16 pb-8 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 font-medium">
          Personal Think Tank
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          你的个人智囊团
        </h1>
        <p className="text-white/50 text-lg max-w-md mx-auto leading-relaxed">
          选择一位思想家，以他的心智模型与你深度对话
        </p>
      </header>

      {/* Character Grid */}
      <section className="flex-1 max-w-5xl mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/chat/${character.id}`}
              className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer block"
            >
              {/* Avatar */}
              <div className="relative h-52 w-full overflow-hidden bg-white/5">
                <CardImage character={character} />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-white mb-1">
                  {character.name}
                </h2>
                <p className="text-xs text-white/40 mb-3">{character.title}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {character.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded-full border"
                      style={{
                        borderColor: `${character.accentColor}40`,
                        color: character.accentColor,
                        background: `${character.accentColor}15`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-white/55 leading-relaxed line-clamp-3">
                  {character.description}
                </p>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <div
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-center transition-all duration-200 border opacity-0 group-hover:opacity-100"
                  style={{
                    borderColor: `${character.accentColor}60`,
                    color: character.accentColor,
                    background: `${character.accentColor}15`,
                  }}
                >
                  开始对话 →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-white/20 text-xs">
        基于公开信息提炼的思维框架，仅供参考学习
      </footer>
    </main>
  );
}
