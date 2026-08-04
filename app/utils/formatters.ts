/**
 * Nuxt 4 Auto-Imported Formatters Utility
 */

export const formatTime = (dateStr?: string): string => {
  if (!dateStr) return "Hace un momento";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "Hace un momento";

  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} min`;

  const hours = Math.floor(diffMins / 60);
  if (hours < 24) return `Hace ${hours} h`;

  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatSalary = (val?: number): string => {
  if (val === undefined || val === null || val === 0) return "No especificado";
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatSalaryDisplay = (job?: {
  salario?: number | string;
  salarioMinimo?: number;
  salarioMaximo?: number;
}): string | null => {
  if (!job) return null;
  const min = job.salarioMinimo ? Number(job.salarioMinimo) : 0;
  const max = job.salarioMaximo ? Number(job.salarioMaximo) : 0;
  const single = job.salario ? Number(job.salario) : 0;

  const formatAmount = (num: number): string => {
    if (num >= 1000) {
      const k = num / 1000;
      return `${Number.isInteger(k) ? k : k.toFixed(1)}k MXN`;
    }
    return `${num.toLocaleString("es-MX")} MXN`;
  };

  if (min > 0 && max > 0) {
    if (min === max) {
      return `${formatAmount(min)} / mes`;
    }
    return `${formatAmount(min)} - ${formatAmount(max)} / mes`;
  }

  if (min > 0) {
    return `Desde ${formatAmount(min)} / mes`;
  }

  if (max > 0) {
    return `Hasta ${formatAmount(max)} / mes`;
  }

  if (single > 0) {
    return `${formatAmount(single)} / mes`;
  }

  return null;
};
