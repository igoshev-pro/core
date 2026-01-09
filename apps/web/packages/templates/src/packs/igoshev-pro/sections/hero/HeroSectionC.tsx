"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Play, ArrowRight } from "lucide-react";

export default function HeroSectionC({ node, ctx }: any) {
  const smoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Сайт с системой заявок{" "}
              <span className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] bg-clip-text text-transparent">
                за 7 дней
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8">Фиксированная цена • Без сюрпризов • С поддержкой</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                onClick={() => smoothScroll("cta")}
                className="bg-gradient-to-r from-[#34C759] to-[#00C7BE] hover:shadow-xl hover:shadow-[#34C759]/50 transition-all text-lg px-8 text-white rounded-full"
              >
                Получить предложение
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur text-lg rounded-full"
              >
                Смотреть демо <ArrowRight className="ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Check className="text-[#34C759]" size={20} />
                <span className="text-sm">150+ запущенных сайтов</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-[#34C759]" size={20} />
                <span className="text-sm">87% клиентов остаются &gt; 1 года</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-[#34C759]" size={20} />
                <span className="text-sm">Средний рост заявок: +180%</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-4 shadow-2xl"
            >
              {/* Video Player */}
              <div className="relative aspect-video bg-gradient-to-br from-[#34C759]/10 to-[#00C7BE]/10 rounded-3xl overflow-hidden group cursor-pointer">
                {/* Video Thumbnail/Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#34C759]/20 to-[#00C7BE]/20 flex items-center justify-center">
                  {/* Play Button */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative w-20 h-20 bg-gradient-to-r from-[#34C759] to-[#00C7BE] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                {/* Video Duration Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-sm">
                  2:34
                </div>
              </div>
              <div className="mt-4 space-y-2 px-2">
                <div className="h-3 bg-white/20 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
