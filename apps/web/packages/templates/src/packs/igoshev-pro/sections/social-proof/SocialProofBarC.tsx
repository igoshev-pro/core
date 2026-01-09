"use client";

export default function SocialProofBarC({ node, ctx }: any) {
  return (
    <section className="relative py-8 border-y border-white/10 bg-white/5 backdrop-blur">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-300 mb-4">Нам доверяют клиники, юридические компании и салоны красоты</p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full">
            <span className="font-semibold">150+ сайтов</span>
          </div>
          <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full">
            <span className="font-semibold">7 дней запуск</span>
          </div>
          <div className="px-6 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full">
            <span className="font-semibold">98% довольны</span>
          </div>
        </div>
      </div>
    </section>
  );
}
