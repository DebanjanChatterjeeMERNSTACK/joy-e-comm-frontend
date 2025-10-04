// src/components/SellInvoicePDF.js
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF"
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "1pt solid #e4e4e4"
  },
  companyInfo: {
    flex: 2,
  },
  invoiceInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c5aa0",
    marginBottom: 4
  },
  companyTagline: {
    fontSize: 9,
    color: "#666",
    marginBottom: 8
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c5aa0",
    marginBottom: 8
  },
  invoiceNumber: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333"
  },
  badge: {
    backgroundColor: "#2c5aa0",
    color: "white",
    padding: "4px 12px",
    borderRadius: 10,
    fontSize: 8,
    fontWeight: "bold"
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  column: {
    width: "48%"
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c5aa0",
    paddingBottom: 4,
    borderBottom: "1pt solid #2c5aa0"
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#555",
    width: "30%"
  },
  infoValue: {
    width: "70%",
    color: "#333"
  },
  table: {
    marginTop: 10,
    border: "1pt solid #e4e4e4",
    borderRadius: 4,
    overflow: "hidden"
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2c5aa0",
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 9,
    fontWeight: "bold"
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 4
  },
  tableCol: {
    padding: 2,
    fontSize: 8
  },
  colProduct: { width: "20%" },
  colUnits: { width: "10%", textAlign: "center" },
  colQty: { width: "8%", textAlign: "center" },
  colPrice: { width: "12%", textAlign: "right" },
  colGst: { width: "8%", textAlign: "center" },
  colTax: { width: "12%", textAlign: "right" },
  colDiscount: { width: "10%", textAlign: "right" },
  colAmount: { width: "15%", textAlign: "right", fontWeight: "bold" },
  summarySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
    border: "1pt solid #e4e4e4"
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingVertical: 2
  },
  summaryLabel: {
    color: "#555",
    fontSize: 10
  },
  summaryValue: {
    color: "#333",
    fontSize: 10,
    fontWeight: "bold"
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1pt solid #2c5aa0"
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c5aa0"
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c5aa0"
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
    borderTop: "1pt solid #e4e4e4",
    paddingTop: 10
  },
  notes: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#fff8e1",
    border: "1pt solid #ffd54f",
    borderRadius: 4
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#e65100"
  }
});

export default function SellInvoicePDF({ invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header} fixed>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{invoice?.adminId?.storeName || "STORE NAME"}</Text>
              <Text style={styles.companyTagline}>Quality Products & Excellent Service</Text>
              <Text>{invoice?.adminId?.address}</Text>
              <Text>Phone: {invoice?.adminId?.phoneNumber} | Email: {invoice?.adminId?.email}</Text>
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <View style={styles.badge}>
                <Text>PAID</Text>
              </View>
              <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            </View>
          </View>

          {/* Customer & Invoice Details */}
          <View style={styles.twoColumn} fixed>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>BILL TO</Text>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>{invoice.customerName}</Text>
              <Text>Address: {invoice.address}</Text>
              <Text>Phone: {invoice.phoneNumber}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>INVOICE DETAILS</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invoice Date:</Text>
                <Text style={styles.infoValue}>{new Date(invoice.invoiceDate).toLocaleDateString("en-GB")}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invoice No: </Text>
                <Text style={styles.infoValue}>
                  {invoice.invoiceNumber}
                </Text>
              </View>
              {/* <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Terms:</Text>
                <Text style={styles.infoValue}>Net 15 Days</Text>
              </View> */}
            </View>
          </View>

          {/* Items Table */}
          <Text style={styles.sectionTitle}>ITEMS</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCol, styles.colProduct]}>PRODUCT</Text>
              <Text style={[styles.tableCol, styles.colUnits]}>UNITS</Text>
              <Text style={[styles.tableCol, styles.colQty]}>QTY</Text>
              <Text style={[styles.tableCol, styles.colPrice]}>PRICE</Text>
              <Text style={[styles.tableCol, styles.colGst]}>GST %</Text>
              <Text style={[styles.tableCol, styles.colTax]}>TAX</Text>
              <Text style={[styles.tableCol, styles.colDiscount]}>DISCOUNT</Text>
              <Text style={[styles.tableCol, styles.colAmount]}>AMOUNT</Text>
            </View>
            
            {/* Table Rows */}
            {invoice.item?.map((item, idx) => (
              <View style={[styles.tableRow, { backgroundColor: idx % 2 === 0 ? "#fafafa" : "white" }]} key={idx}>
                <Text style={[styles.tableCol, styles.colProduct]}>{item.productName}</Text>
                <Text style={[styles.tableCol, styles.colUnits]}>{item.units}</Text>
                <Text style={[styles.tableCol, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.tableCol, styles.colPrice]}>{parseFloat(item.sellPrice).toFixed(2)}</Text>
                <Text style={[styles.tableCol, styles.colGst]}>{item.gst}%</Text>
                <Text style={[styles.tableCol, styles.colTax]}>{parseFloat(item.taxAmount).toFixed(2)}</Text>
                <Text style={[styles.tableCol, styles.colDiscount]}>{parseFloat(item.discount).toFixed(2)}</Text>
                <Text style={[styles.tableCol, styles.colAmount]}>{parseFloat(item.amount).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                {parseFloat(invoice.grandTotal - invoice.totalTaxAmount + invoice.totalDiscountAmount - (invoice.transportCharge || 0) + (invoice.roundOff || 0)).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Tax:</Text>
              <Text style={styles.summaryValue}>{parseFloat(invoice.totalTaxAmount).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Discount:</Text>
              <Text style={styles.summaryValue}>-{parseFloat(invoice.totalDiscountAmount).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Transport Charge:</Text>
              <Text style={styles.summaryValue}>+{parseFloat(invoice.transportCharge || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Round Off:</Text>
              <Text style={styles.summaryValue}>{parseFloat(invoice.roundOff || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL:</Text>
              <Text style={styles.grandTotalValue}>₹{parseFloat(invoice.grandTotal).toFixed(2)}</Text>
            </View>
          </View>

          {/* Notes Section */}
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>NOTES</Text>
            <Text>• Thank you for your business!</Text>
            {/* <Text>• Payment is due within 15 days</Text> */}
            <Text>• Please quote invoice number when making payment</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>This is a computer-generated invoice and does not require a signature</Text>
            <Text>{invoice?.adminId?.storeName} •</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}