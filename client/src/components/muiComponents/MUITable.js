import React, { useContext } from "react";
import { Card, Typography } from "@mui/material";
import { DateTimeConverter } from "../MiscJavascript";
import { themeContext } from "./ThemeContext";
// import MaterialTable from "material-table";
// import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/styles";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
let theme = createTheme();
theme = responsiveFontSizes(theme);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////DevNote: JB/////////////////////////////////////////////////////////////////////////////////////////////
//////Not implemented muidatatables due to bug in print pdf and UI look/feel is not good enough.//////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const styles = {
//   common: {
//     overflow: "auto",
//     "-ms-overflow-style": "none",
//     "::-webkit-scrollbar": {
//       display: "none",
//     },
//   },
// };

const columns = [
  { label: "Id", name: "id" },
  { label: "Username", name: "username" },
  { label: "Action", name: "action" },
  { label: "Message", name: "message" },
  {
    label: "Previous Value",
    name: "prevValue",
    options: {
      customBodyRender: (value, tableMeta, updateValue) =>
        value === null ? "" : JSON.stringify(value),
    },
  },
  {
    label: "New Value",
    name: "newValue",
    options: {
      customBodyRender: (value, tableMeta, updateValue) =>
        value === null ? "" : JSON.stringify(value),
    },
  },
  { label: "Error", name: "name" },
  {
    label: "Created Date",
    name: "createdAt",
    options: {
      customBodyRender: (value, tableMeta, updateValue) =>
        value === DateTimeConverter(value),
    },
  },
  {
    label: "Updated Date",
    name: "updatedAt",
    options: {
      customBodyRender: (value, tableMeta, updateValue) =>
        value === DateTimeConverter(value),
    },
  },
];

const options = {
  filterType: "checkbox",
};

function MainTable({ loading, rows }) {
  // const { darkMode } = useContext(themeContext);
  const data = rows.map((row) => {
    return { ...row, username: row.User.username };
  });
  const isEmpty = data.length === 0;

  if (isEmpty && !loading) {
    return (
      <Card sx={{ textAlign: "center", width: "95%", padding: 2 }}>
        <Typography>No results found.</Typography>
      </Card>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <MUIDataTable
        columns={columns}
        data={data}
        title="History"
        options={options}
        sx={{ height: 500 }}
      />
    </ThemeProvider>
  );
}

export default MainTable;
