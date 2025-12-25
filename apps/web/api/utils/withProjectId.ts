export function withProjectId(
  params?: Record<string, string | number | undefined>
) {
  const search = new URLSearchParams();

  // всегда добавляем переданные параметры (limit, offset и т.д.)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        search.set(key, String(value));
      }
    });
  }

  // pid добавляем ТОЛЬКО в development
  if (process.env.NODE_ENV === "development") {
    search.set("pid", "694900375118e605d8b89551");
  }

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
