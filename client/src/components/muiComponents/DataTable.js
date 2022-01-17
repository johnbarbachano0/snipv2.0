import React, { useState } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { DateTimeConverter } from "../MiscJavascript";
import useWindowDimensions from "../useWindowDimension";

const columns = [
  { id: "id", label: "Id" },
  { id: "user", label: "User" },
  { id: "action", label: "Action" },
  { id: "message", label: "Message" },
  { id: "prevValue", label: "Prev Value" },
  { id: "newValue", label: "New Value" },
  { id: "error", label: "Error" },
  { id: "createdAt", label: "Created Date" },
  { id: "updatedAt", label: "Updated Date" },
];

function DataTable({ loading, rows }) {
  const dimension = useWindowDimensions();
  const isEmpty = rows.length === 0;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (isEmpty && !loading) {
    return (
      <Card sx={{ width: "95%", padding: 2 }}>
        <Typography>No results found.</Typography>
      </Card>
    );
  }
  if (!isEmpty && !loading) {
    return (
      <>
        <TableContainer
          component={Paper}
          style={{
            overflow: "auto",
            width: "100%",
            height: dimension.height - 120,
          }}
        >
          <Table stickyHeader size={"small"}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ maxWidth: column.maxWidth }}
                    align={"center"}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ maxWidth: 50 }} align={"center"}>
                      {row.id}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: "auto" }}>
                      {row.User.username}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 150, overflow: "auto" }}>
                      {row.action}
                    </TableCell>
                    <TableCell sx={{ width: 200, overflow: "auto" }}>
                      {row.message}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400, overflow: "auto" }}>
                      {row.prevValue !== null
                        ? JSON.stringify(row.prevValue)
                        : ""}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400, overflow: "auto" }}>
                      {row.newValue !== null
                        ? JSON.stringify(row.newValue)
                        : ""}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400, overflow: "auto" }}>
                      {row.error !== null ? JSON.stringify(row.error) : ""}
                    </TableCell>
                    <TableCell
                      sx={{ minWidth: 150, overflow: "auto" }}
                      align={"center"}
                    >
                      {DateTimeConverter(row.createdAt)}
                    </TableCell>
                    <TableCell
                      sx={{ minWidth: 150, overflow: "auto" }}
                      align={"center"}
                    >
                      {DateTimeConverter(row.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    );
  }

  return null;
}

export default DataTable;
