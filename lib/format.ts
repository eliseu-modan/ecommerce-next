export function formatCurrency(value: number | string) {
  const amount =
    typeof value === "number" ? value : Number.parseFloat(String(value));

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value?: string | Date | null) {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getInitials(name?: string | null) {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function getProductImage(url?: string | null) {
  return url || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80";
}

export function toAddressLabel(address: {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  complement?: string | null;
}) {
  const parts = [
    `${address.street}, ${address.number}`,
    address.complement || "",
    address.neighborhood,
    `${address.city} - ${address.state}`,
    address.zipCode,
    address.country,
  ];

  return parts.filter(Boolean).join(", ");
}
