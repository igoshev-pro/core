"use client";

import { Button, Input, Select, SelectItem, Textarea, Checkbox, Card } from "@heroui/react";
import { useState } from "react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa6";

export default function FinalCTASectionC({ node, ctx }: any) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    niche: "",
    comment: "",
    privacy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const niches = [
    "Стоматология",
    "Юридические услуги",
    "Салоны красоты",
    "Автосервис",
    "Ремонт",
    "Другое",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.niche || !formData.privacy) {
      return;
    }

    setIsSubmitting(true);

    // Аналитика
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "form_submit", {
        form_type: "final_cta",
      });
    }

    // Здесь будет отправка формы на сервер
    try {
      // await submitForm(formData);
      console.log("Form submitted:", formData);
      alert("Спасибо! Мы свяжемся с вами в течение 30 минут.");
      setFormData({
        name: "",
        phone: "",
        niche: "",
        comment: "",
        privacy: false,
      });
    } catch (error) {
      console.error("Form error:", error);
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "form_error", {
          error_type: "submit_failed",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "form_field_fill", {
        field_name: field,
      });
    }
  };

  return (
    <section
      id="contact-form"
      className="w-full py-20 px-4 bg-primary-gradient"
    >
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Готовы запустить сайт за 7 дней?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="flex flex-col gap-3 p-3 rounded-4xl">
            <div className="p-4 md:p-7 space-y-4">
              <Input
                label="Имя"
                placeholder="Ваше имя"
                value={formData.name}
                onValueChange={(value) => handleFieldChange("name", value)}
                isRequired
                variant="bordered"
                size="lg"
              />

              <Input
                label="Телефон"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onValueChange={(value) => handleFieldChange("phone", value)}
                isRequired
                variant="bordered"
                size="lg"
                type="tel"
              />

              <Select
                label="Ниша"
                placeholder="Выберите сферу бизнеса"
                selectedKeys={formData.niche ? [formData.niche] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleFieldChange("niche", value);
                }}
                isRequired
                variant="bordered"
                size="lg"
              >
                {niches.map((niche) => (
                  <SelectItem key={niche}>
                    {niche}
                  </SelectItem>
                ))}
              </Select>

              <Textarea
                label="Комментарий (опционально)"
                placeholder="Расскажите о вашем проекте"
                value={formData.comment}
                onValueChange={(value) => handleFieldChange("comment", value)}
                variant="bordered"
                minRows={3}
              />

              <Checkbox
                isSelected={formData.privacy}
                onValueChange={(value) => handleFieldChange("privacy", value)}
                isRequired
              >
                <span className="text-sm text-foreground-600">
                  Согласен с{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    политикой конфиденциальности
                  </a>
                </span>
              </Checkbox>

              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-semibold bg-primary-gradient"
                isLoading={isSubmitting}
                isDisabled={!formData.name || !formData.phone || !formData.niche || !formData.privacy}
              >
                Получить предложение
              </Button>

              <p className="text-center text-sm text-foreground-600">
                Перезвоним в течение 30 минут в рабочее время
              </p>
            </div>
          </Card>
        </form>

        {/* Alternative Contact Methods */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-foreground-600">или позвоните: +7 (XXX) XXX-XX-XX</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="light"
              startContent={<FaTelegram />}
              as="a"
              href="https://t.me/example"
              target="_blank"
            >
              Telegram
            </Button>
            <Button
              variant="light"
              startContent={<FaWhatsapp />}
              as="a"
              href="https://wa.me/79991234567"
              target="_blank"
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
