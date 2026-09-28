import { InvoiceStatus } from "../enums.js";
export type InvoiceAmounts = {
    totalAzn: number;
    paidAzn: number;
};
/** Faktura statusunu ödəniş məbləğinə görə yeniləyir */
export declare function deriveInvoiceStatus(current: InvoiceStatus, amounts: InvoiceAmounts, dueDate: Date, now: Date): InvoiceStatus;
export type DebtPolicy = {
    warningAfterDays: number;
    suspendAfterDays: number | null;
};
export declare function daysPastDue(dueDate: Date, now: Date): number;
export declare function shouldShowDebtWarning(status: InvoiceStatus, dueDate: Date, now: Date, policy: DebtPolicy): boolean;
