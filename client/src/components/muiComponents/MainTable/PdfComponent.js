import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    margin: "20 auto 20 auto",
    padding: "30",
    paddingBottom: "50",
  },
  table: {
    display: "table",
    width: "100%",
    "&:first-child": {
      borderStyle: "solid",
      borderColor: "#bfbfbf",
      borderLeftWidth: 1,
    },
  },
  tableRow: {
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
  tableColHeader: {
    backgroundColor: "#02475E",
    color: "#fff",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    padding: 5,
    "&:first-child": {
      borderStyle: "solid",
      borderColor: "#bfbfbf",
      borderLeftWidth: 1,
    },
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: "auto",
    fontSize: 11,
    fontWeight: 500,
  },
  tableCell: {
    margin: "auto",
    padding: 5,
    fontSize: 10,
    overflow: "hidden",
  },
});

function PdfComponent({ rows, columns }) {
  return (
    <Document>
      <Page style={styles.body} orientation={"landscape"}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {columns?.map((column, index) => (
              <View
                key={index}
                style={{ ...styles.tableColHeader, width: column.pdfWidth }}
              >
                <Text style={styles.tableCellHeader}>{column.label}</Text>
              </View>
            ))}
          </View>
          {rows?.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              {columns?.map((col, ind) => (
                <View
                  key={ind}
                  style={{
                    ...styles.tableCol,
                    width: col.pdfWidth,
                  }}
                >
                  <Text
                    style={{
                      ...styles.tableCell,
                      textAlign: col.colAlign,
                      width: col.pdfWidth,
                    }}
                  >
                    {row[col.id]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export default PdfComponent;
