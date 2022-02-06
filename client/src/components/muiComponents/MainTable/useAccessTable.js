import React, { useState } from "react";
import { MenuItem, Switch, Select, Typography } from "@mui/material";
import { DateTimeConverter } from "../../MiscJavascript";
import { patchUsers } from "../../../api/api";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function useAccessTable() {
  const [newData, setNewData] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
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
      id: "username",
      label: "Username",
      minWidth: 125,
      maxWidth: 150,
      rowAlign: "center",
      colAlign: "left",
      pdfWidth: 175,
    },
    {
      id: "role",
      label: "Role",
      minWidth: 125,
      maxWidth: 150,
      rowAlign: "center",
      colAlign: "center",
      pdfWidth: 40,
      renderCell: (data, row) => (
        <Select
          value={data}
          onChange={(e) => handleChange({ role: e.target.value, id: row.id })}
          sx={{ width: "100%" }}
        >
          <MenuItem value={"Admin"}>Admin</MenuItem>
          <MenuItem value={"User"}>User</MenuItem>
        </Select>
      ),
    },
    {
      id: "provider",
      label: "Provider",
      minWidth: 125,
      maxWidth: 150,
      pdfWidth: 60,
      rowAlign: "center",
      colAlign: "center",
      renderCell: (data) =>
        data === "Google" ? (
          <GoogleIcon
            sx={{
              color: "#34A853",
              "&:hover": { color: "#EA4335" },
            }}
          />
        ) : data === "Facebook" ? (
          <FacebookIcon
            sx={{ color: "#4267B2", "&:hover": { color: "#4267D2" } }}
          />
        ) : data === "Snip" ? (
          <Typography
            sx={{
              color: "#ffea00",
              "&:hover": { color: "rgba(255, 251, 0, 0.635)" },
              fontFamily: "Sonsie One",
            }}
          >
            snip
          </Typography>
        ) : data === "Github" ? (
          <GitHubIcon sx={{ "&:hover": { color: "red" } }} />
        ) : (
          data
        ),
    },
    {
      id: "email",
      label: "Email",
      minWidth: 125,
      maxWidth: 150,
      pdfWidth: 175,
      rowAlign: "center",
      colAlign: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 125,
      maxWidth: 150,
      pdfWidth: 50,
      rowAlign: "center",
      colAlign: "center",
      renderCell: (data, row) => (
        <Switch
          defaultChecked={data}
          onChange={(e) =>
            handleChange({ status: e.target.checked, id: row.id })
          }
        />
      ),
      renderExport: (data) => (data ? "Active" : "Inactive"),
    },
    {
      id: "lastLogin",
      label: "Last Login",
      minWidth: 150,
      maxWidth: 150,
      pdfWidth: 75,
      rowAlign: "center",
      colAlign: "center",
      renderCell: (data) => DateTimeConverter(data, 2),
      renderExport: (data) => DateTimeConverter(data),
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
      maxWidth: 100,
      pdfWidth: 75,
      rowAlign: "center",
      colAlign: "center",
      renderCell: (data) => DateTimeConverter(data, 2),
      renderExport: (data) => DateTimeConverter(data),
    },
  ];

  function handleChange(data) {
    patchUsers(data)
      .then((res) => {
        setIsSuccess(res);
        setNewData(data);
      })
      .catch((error) => setIsSuccess(false));
  }

  return { columns, newData, isSuccess };
}
