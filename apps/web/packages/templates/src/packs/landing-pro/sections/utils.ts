// Утилита для санитизации ctx - убирает функции, которые нельзя сериализовать
// для передачи в клиентские компоненты
export function sanitizeCtx(ctx: any) {
  const { helpers, ...ctxWithoutHelpers } = ctx;
  return {
    ...ctxWithoutHelpers,
    // helpers не передаем в клиентские компоненты, так как содержат функции
  };
}
