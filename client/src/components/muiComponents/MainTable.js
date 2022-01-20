import React, { useContext } from "react";
import { Card, Typography } from "@mui/material";
import { DateTimeConverter } from "../MiscJavascript";
// import { themeContext } from "./ThemeContext";
import MaterialTable from "material-table";

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////DevNote: JB////////////////////////////////////////////////////////////////////////////////////
//////Not implemented material table due to compatibility issue and no fix available yet.////////////
//////Compatibility issue causes the navbar style to not function properly.//////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

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
  { title: "Id", field: "id" },
  { title: "Username", field: "username" },
  { title: "Action", field: "action" },
  { title: "Message", field: "message" },
  { title: "Previous Value", field: "prevValue" },
  { title: "New Value", field: "newValue" },
  { title: "Error", field: "error" },
  { title: "Created Date", field: "createdAt" },
  { title: "Updated Date", field: "updatedAt" },
];

function MainTable({ loading, rows }) {
  // const { darkMode } = useContext(themeContext);
  const data = rows.map((row) => {
    return {
      ...row,
      username: row.User.username,
      createdAt: DateTimeConverter(row.createdAt),
      updatedAt: DateTimeConverter(row.updatedAt),
      prevValue: JSON.stringify(row.prevValue),
      newValue: JSON.stringify(row.newValue),
    };
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
    <MaterialTable
      columns={columns}
      data={data}
      title="History"
      options={{
        exportButton: true,
      }}
    />
  );
}

export default MainTable;
