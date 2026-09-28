import { InvoiceStatus } from "../enums.js";
/** Faktura statusunu ödəniş məbləğinə görə yeniləyir */
export function deriveInvoiceStatus(current, amounts, dueDate, now) {
    if (current === InvoiceStatus.Draft ||
        current === InvoiceStatus.WrittenOff) {
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
export function daysPastDue(dueDate, now) {
    const ms = now.getTime() - dueDate.getTime();
    if (ms <= 0)
        return 0;
    return Math.floor(ms / (24 * 60 * 60 * 1000));
}
export function shouldShowDebtWarning(status, dueDate, now, policy) {
    if (status !== InvoiceStatus.Overdue &&
        status !== InvoiceStatus.PartiallyPaid &&
        status !== InvoiceStatus.Issued) {
        return false;
    }
    return daysPastDue(dueDate, now) >= policy.warningAfterDays;
}
