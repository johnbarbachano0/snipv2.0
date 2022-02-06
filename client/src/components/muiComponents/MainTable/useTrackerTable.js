import { useState } from "react";
import { Capitalize, DateTimeConverter } from "../../MiscJavascript";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";

export default function useTrackerTable() {
  const userObj = JSON.parse(sessionStorage.user);
  const [deleteData, setDeleteData] = useState(null);
  const [editData, setEditData] = useState(null);

  const columns = [
    {
      id: "id",
      label: "Id",
      minWidth: 75,
      maxWidth: 100,
      rowAlign: "center",
      colAlign: "center",
      pdfWidth: 50,
    },
    {
      id: "title",
      label: "Title",
      minWidth: 125,
      maxWidth: 150,
      pdfWidth: 100,
      rowAlign: "center",
      colAlign: "center",
    },
    {
      id: "changelog",
      label: "Changelog",
      minWidth: 200,
      maxWidth: 400,
      pdfWidth: 300,
      rowAlign: "center",
      colAlign: "left",
    },
    {
      id: "documentStatusDesc",
      label: "Status",
      minWidth: 75,
      maxWidth: 100,
      pdfWidth: 50,
      rowAlign: "center",
      colAlign: "center",
      renderCell: (data) => Capitalize(data),
      renderExport: (data) => Capitalize(data),
    },
    {
      id: "username",
      label: "Owner",
      minWidth: 150,
      maxWidth: 150,
      pdfWidth: 75,
      rowAlign: "center",
      colAlign: "center",
    },
    {
      id: "createdAt",
      label: "Created Date",
      minWidth: 150,
      maxWidth: 150,
      pdfWidth: 75,
      rowAlign: "center",
      colAlign: "center",
      renderCell: (data) => DateTimeConverter(data, 2),
      renderExport: (data) => DateTimeConverter(data),
    },
    {
      id: "updatedAt",
      label: "Updated Date",
      minWidth: 150,
      maxWidth: 150,
      pdfWidth: 75,
      rowAlign: "center",
      colAlign: "center",
      renderCell: (data) => DateTimeConverter(data, 2),
      renderExport: (data) => DateTimeConverter(data),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 100,
      maxWidth: 100,
      pdfWidth: 0,
      rowAlign: "center",
      colAlign: "center",
      renderCell: (data, row) => {
        const isDisabled = userObj.id !== row.UserId;
        return (
          <Box>
            <Tooltip title="Delete">
              <span>
                <IconButton
                  size={"small"}
                  onClick={() => setDeleteData(row.id)}
                  disabled={isDisabled}
                >
                  <DeleteIcon color={isDisabled ? "gray" : "error"} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Edit">
              <span>
                <IconButton
                  size={"small"}
                  onClick={() => setEditData(row)}
                  disabled={isDisabled}
                >
                  <EditIcon color={isDisabled ? "gray" : "primary"} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return { columns, deleteData, setDeleteData, editData, setEditData };
}
