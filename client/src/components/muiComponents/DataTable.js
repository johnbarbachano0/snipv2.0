import React, { useState, useContext, useRef, useEffect } from "react";
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
import {
  DateConverter,
  TimeConverter,
  DateTimeConverter,
  Capitalize,
} from "../MiscJavascript";
import useWindowDimensions from "../useWindowDimension";
import { themeContext } from "./ThemeContext";
import ArrowUp from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDown from "@mui/icons-material/ArrowDownwardRounded";
import DataTablePaginationActions from "./DataTablePaginationActions";
import { CSVLink } from "react-csv";

const styles = {
  common: {
    overflow: "auto",
    msOverflowStyle: "none",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
};

const columns = [
  { id: "id", label: "Id", minWidth: 75, maxWidth: 100 },
  { id: "user", label: "Username", minWidth: 125, maxWidth: 150 },
  { id: "action", label: "Action", minWidth: 125, maxWidth: 150 },
  { id: "message", label: "Message", minWidth: 150, maxWidth: 300 },
  { id: "prevValue", label: "Prev Value", minWidth: 200, maxWidth: 400 },
  { id: "newValue", label: "New Value", minWidth: 200, width: 400 },
  { id: "error", label: "Error", minWidth: 125, width: 400 },
  { id: "createdAt", label: "Created Date", minWidth: 150, maxWidth: 150 },
  { id: "updatedAt", label: "Updated Date", minWidth: 150, maxWidth: 150 },
];

const keyValidator = (key, value, dataObj) => {
  return key === "accessToken" || key === "refreshToken"
    ? value
      ? value?.substring(0, 40) + "..."
      : "<blank>"
    : key === "status"
    ? value === "true"
      ? "Active"
      : "Inactive"
    : key === "createdAt" || key === "updatedAt" || key === "lastLogin"
    ? DateTimeConverter(value)
    : value === null
    ? "<blank>"
    : value;
};

const displayObj = (dataObj) => {
  const list = [];
  for (const [key, value] of Object.entries(dataObj)) {
    list.push(
      <li key={key}>
        {Capitalize(key)}: {keyValidator(key, value, dataObj)}
      </li>
    );
  }
  return list;
};

const csvObj = (dataObj) => {
  const list = [];
  for (const [key, value] of Object.entries(dataObj)) {
    list.push(`${Capitalize(key)} : ${keyValidator(key, value, dataObj)}`);
  }
  return list.join("\r").replace(new RegExp(`"`, "g"), "");
};

function DataTable({ loading, rows, onExport }) {
  const csvLink = useRef(null);
  const { darkMode } = useContext(themeContext);
  const dimension = useWindowDimensions();
  const isEmpty = rows.length === 0;
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ field: "createdAt", order: "desc" });
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (field, order) => {
    setSort((prev) => {
      var newOrder;
      if (field !== prev.field) {
        newOrder = prev.order;
      } else {
        newOrder = order === "asc" ? "desc" : "asc";
      }
      return { field, order: newOrder };
    });
  };

  function descendingComparator(a, b, orderBy) {
    switch (orderBy) {
      case "user": {
        if (b.User.username < a.User.username) {
          return -1;
        }
        if (b.User.username > a.User.username) {
          return 1;
        }
        break;
      }
      case "prevValue":
      case "newValue":
      case "error": {
        if (b[orderBy]?.id < a[orderBy]?.id || b[orderBy] === null) {
          return -1;
        }
        if (b[orderBy]?.id > a[orderBy]?.id || a[orderBy] === null) {
          return 1;
        }
        break;
      }
      default:
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
    }
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  useEffect(() => {
    csvLink?.current?.link.click();
  }, [onExport]);

  if (isEmpty && !loading) {
    return (
      <Card sx={{ textAlign: "center", width: "95%", padding: 2 }}>
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
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      backgroundColor: darkMode ? "#02475E" : "#8AB6D6",
                    }}
                    align={"center"}
                    onClick={() => handleSort(column.id, sort.order)}
                  >
                    {column.label}
                    {sort.order === "desc"
                      ? sort.field === column.id && (
                          <ArrowUp fontSize="small" sx={{ color: "red" }} />
                        )
                      : sort.field === column.id && (
                          <ArrowDown fontSize="small" sx={{ color: "blue" }} />
                        )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .sort(getComparator(sort.order, sort.field))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor:
                        index % 2 === 0 ? (darkMode ? "#222" : "#ddd") : null,
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        sx={{
                          minWidth: col.minWidth,
                          maxWidth:
                            col.id === "prevValue" ||
                            col.id === "newValue" ||
                            col.id === "error"
                              ? 400
                              : col.maxWidth,
                          ...styles.common,
                        }}
                        align={
                          col.id === "prevValue" ||
                          col.id === "newValue" ||
                          col.id === "error"
                            ? "left"
                            : "center"
                        }
                      >
                        {col.id === "prevValue" || col.id === "newValue"
                          ? row[col.id] === null
                            ? ""
                            : displayObj(row[col.id])
                          : col.id === "createdAt" || col.id === "updatedAt"
                          ? DateTimeConverter(row[col.id])
                          : col.id === "user"
                          ? row.User.username
                          : row[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100, { value: -1, label: "All" }]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={DataTablePaginationActions}
        />
        <CSVLink
          data={rows.sort(getComparator(sort.order, sort.field)).map((row) =>
            columns.map((col) => {
              return col.id === "prevValue" ||
                col.id === "newValue" ||
                col.id === "error"
                ? row[col.id] === null
                  ? ""
                  : csvObj(row[col.id])
                : col.id === "createdAt" || col.id === "updatedAt"
                ? DateTimeConverter(row[col.id])
                : col.id === "user"
                ? row.User.username
                : row[col.id];
            })
          )}
          headers={columns.map((column) => column.label)}
          target="_blank"
          filename={`History_as_of_${DateConverter(Date.now())}_${TimeConverter(
            Date.now()
          )}`}
          ref={csvLink}
          sx={{ display: "none" }}
        />
      </>
    );
  }

  return null;
}

export default DataTable;
