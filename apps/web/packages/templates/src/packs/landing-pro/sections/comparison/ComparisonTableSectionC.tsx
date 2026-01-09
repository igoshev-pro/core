"use client";

import { Card, CardBody, Divider } from "@heroui/react";
import { Button } from "@heroui/react";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function ComparisonTableSectionC({ node, ctx }: any) {
  const comparisons = [
    {
      feature: "Срок",
      freelancer: "1-3 мес",
      studio: "2-6 мес",
      constructor: "1-4 нед",
      us: "7 дней ✓",
      usHighlight: true,
    },
    {
      feature: "Цена (старт)",
      freelancer: "30-80К",
      studio: "150-500К",
      constructor: "0-15К",
      us: "19-55К",
      usHighlight: false,
    },
    {
      feature: "Цена (год)",
      freelancer: "50-150К",
      studio: "300-800К",
      constructor: "30-100К",
      us: "78-234К",
      usHighlight: false,
    },
    {
      feature: "Риск срыва",
      freelancer: "56% 🔴",
      studio: "40% 🟡",
      constructor: "Низкий",
      us: "0% ✓",
      usHighlight: true,
    },
    {
      feature: "Поддержка",
      freelancer: "❌",
      studio: "💰",
      constructor: "FAQ",
      us: "✓ Включена",
      usHighlight: true,
    },
    {
      feature: "CRM-интеграция",
      freelancer: "💰",
      studio: "💰",
      constructor: "Ограничено",
      us: "✓ Включена",
      usHighlight: true,
    },
    {
      feature: "Гарантии",
      freelancer: "❌",
      studio: "Договор",
      constructor: "❌",
      us: "✓ Возврат",
      usHighlight: true,
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-foreground-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Честное сравнение способов создания сайта
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Card className="rounded-4xl">
            <table className="w-full bg-background rounded-4xl">
              <thead>
                <tr className="border-b border-foreground-200">
                  <th className="p-4 text-left text-xs font-semibold"> </th>
                  <th className="p-4 text-center text-xs font-semibold">Фрилансер</th>
                  <th className="p-4 text-center text-xs font-semibold">Студия</th>
                  <th className="p-4 text-center text-xs font-semibold">Конструктор</th>
                  <th className="p-4 text-center text-xs font-semibold bg-primary-50">
                    Мы
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-foreground-100 hover:bg-foreground-50 transition-colors"
                  >
                    <td className="p-4 text-xs font-medium">{row.feature}</td>
                    <td className="p-4 text-center text-xs">{row.freelancer}</td>
                    <td className="p-4 text-center text-xs">{row.studio}</td>
                    <td className="p-4 text-center text-xs">{row.constructor}</td>
                    <td
                      className={`p-4 text-center text-xs font-semibold ${
                        row.usHighlight
                          ? "bg-primary-50 text-primary"
                          : "bg-foreground-50"
                      }`}
                    >
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {comparisons.map((row, index) => (
            <Card key={index} className="flex flex-col gap-3 p-3 rounded-4xl">
              <CardBody className="p-4">
                <div className="text-xs font-semibold mb-3">{row.feature}</div>
                <div className="flex flex-col gap-3 p-4 px-4 rounded-[21px]">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <p className="text-foreground-500">Фрилансер</p>
                    <p>{row.freelancer}</p>
                  </div>
                  <Divider />
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <p className="text-foreground-500">Студия</p>
                    <p>{row.studio}</p>
                  </div>
                  <Divider />
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <p className="text-foreground-500">Конструктор</p>
                    <p>{row.constructor}</p>
                  </div>
                  <Divider />
                  <div className={`flex items-center justify-between gap-3 text-xs ${row.usHighlight ? "text-primary font-semibold" : ""}`}>
                    <p className="text-foreground-500">Мы</p>
                    <p>{row.us}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="bordered"
            onPress={() => {
              if (typeof window !== "undefined" && (window as any).gtag) {
                (window as any).gtag("event", "comparison_link_click");
              }
            }}
          >
            Подробное сравнение →
          </Button>
        </div>
      </div>
    </section>
  );
}
