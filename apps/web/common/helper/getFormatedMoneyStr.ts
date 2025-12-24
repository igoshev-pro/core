export const formatRubleWithThousands = (value: any): string => {
  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) return "—";

  return (
    new Intl.NumberFormat("ru-RU", {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number) + " ₽"
  );
};

export const formatEuroWithThousands = (value: any): string => {
  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) return "—";

  return (
    new Intl.NumberFormat("de-DE", {
      // Немецкий формат чаще используется для евро
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number) + " €"
  );
};

export const formatAmount = (value: any, currency: string): string => {
  if (currency === "EUR") {
    return formatEuroWithThousands(value);
  } else {
    return formatRubleWithThousands(value);
  }
};

export const formatMoneyStr = (value: any[], currency?: string): string => {
  const balance = value.find((item) => item?.currency === currency);

  if (currency === "EUR") {
    return balance ? formatEuroWithThousands(balance.balance) : "0 €";
  } else {
    return balance ? formatRubleWithThousands(balance.balance) : "0 ₽";
  }
};
