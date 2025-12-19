import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const handlebarsHelpers = {
  // Проверка равенства
  eq: (a: any, b: any) => a === b,
  
  // Форматирование даты
  formatDate: (date: Date, format: string = 'DD.MM.YYYY') => {
    return new Intl.DateTimeFormat('ru-RU').format(date);
  },
  
  // Преобразование в верхний регистр
  uppercase: (str: string) => str?.toUpperCase() || '',
  
  // Преобразование в нижний регистр
  lowercase: (str: string) => str?.toLowerCase() || '',
};