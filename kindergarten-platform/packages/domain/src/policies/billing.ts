import { InvoiceStatus } from "../enums.js";

export type InvoiceAmounts = {
  totalAzn: number;
  paidAzn: number;
};

/** Faktura statusunu ödəniş məbləğinə görə yeniləyir */
export function deriveInvoiceStatus(
  current: InvoiceStatus,
  amounts: InvoiceAmounts,
  dueDate: Date,
  now: Date,
): InvoiceStatus {
  if (
    current === InvoiceStatus.Draft ||
    current === InvoiceStatus.WrittenOff
  ) {
    return current;
  }

  const { totalAzn, paidAzn } = amounts;
  if (paidAzn <= 0) {
    if (now > dueDate) {
      return InvoiceStatus.Overdue;
    }
    return InvoiceStatus.Issued;
  }

  if (paidAzn >= totalAzn) {
    return InvoiceStatus.Paid;
  }

  return InvoiceStatus.PartiallyPaid;
}

export type DebtPolicy = {
  warningAfterDays: number;
  suspendAfterDays: number | null;
};

export function daysPastDue(dueDate: Date, now: Date): number {
  const ms = now.getTime() - dueDate.getTime();
  if (ms <= 0) return 0;
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export function shouldShowDebtWarning(
  status: InvoiceStatus,
  dueDate: Date,
  now: Date,
  policy: DebtPolicy,
): boolean {
  if (
    status !== InvoiceStatus.Overdue &&
    status !== InvoiceStatus.PartiallyPaid &&
    status !== InvoiceStatus.Issued
  ) {
    return false;
  }
  return daysPastDue(dueDate, now) >= policy.warningAfterDays;
}
