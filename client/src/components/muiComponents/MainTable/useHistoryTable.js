import {
  Capitalize,
  CapitalizeFirstLetters,
  DateTimeConverter,
} from "../../MiscJavascript";

export default function useAccessTable() {
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
      pdfWidth: 75,
      rowAlign: "center",
      colAlign: "left",
    },
    {
      id: "action",
      label: "Action",
      minWidth: 125,
      maxWidth: 150,
      pdfWidth: 50,
      rowAlign: "center",
      colAlign: "center",
    },
    {
      id: "message",
      label: "Message",
      minWidth: 150,
      maxWidth: 300,
      pdfWidth: 75,
      rowAlign: "center",
      colAlign: "center",
    },
    {
      id: "prevValue",
      label: "Prev Value",
      minWidth: 200,
      maxWidth: 400,
      pdfWidth: 150,
      rowAlign: "center",
      colAlign: "left",
      renderCell: (data) => {
        if (data !== null) {
          const list = [];
          for (const [key, value] of Object.entries(data)) {
            list.push(
              <li key={key}>
                {Capitalize(key)}: {keyValueValidator(key, value)}
              </li>
            );
          }
          return list;
        }
        return "";
      },
      renderExport: (data) => {
        if (data !== null) {
          const list = [];
          for (const [key, value] of Object.entries(data)) {
            list.push(`${Capitalize(key)} : ${keyValueValidator(key, value)}`);
          }
          return list.join("\r").replace(new RegExp(`"`, "g"), "");
        }
        return "";
      },
    },
    {
      id: "newValue",
      label: "New Value",
      minWidth: 200,
      maxWidth: 400,
      pdfWidth: 150,
      rowAlign: "center",
      colAlign: "left",
      renderCell: (data) => {
        if (data !== null) {
          const list = [];
          for (const [key, value] of Object.entries(data)) {
            list.push(
              <li key={key}>
                {Capitalize(key)}: {keyValueValidator(key, value)}
              </li>
            );
          }
          return list;
        }
        return "";
      },
      renderExport: (data) => {
        if (data !== null) {
          const list = [];
          for (const [key, value] of Object.entries(data)) {
            list.push(`${Capitalize(key)} : ${keyValueValidator(key, value)}`);
          }
          return list.join("\r").replace(new RegExp(`"`, "g"), "");
        }
        return "";
      },
    },
    {
      id: "error",
      label: "Error",
      minWidth: 200,
      maxWidth: 400,
      rowAlign: "center",
      colAlign: "left",
      pdfWidth: 75,
    },
    {
      id: "createdAt",
      label: "Created Date",
      minWidth: 150,
      maxWidth: 150,
      pdfWidth: 75,
      rowAlign: "center",
      colAlign: "center",
      renderCell: (data) => DateTimeConverter(data),
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
      renderCell: (data) => DateTimeConverter(data),
      renderExport: (data) => DateTimeConverter(data),
    },
  ];

  const keyValueValidator = (key, value) => {
    return key === "accessToken" || key === "refreshToken"
      ? value
        ? value?.substring(0, 40) + "..."
        : "<blank>"
      : key === "status"
      ? value === true
        ? "Active"
        : "Inactive"
      : key === "provider" && value !== null
      ? Capitalize(value)
      : key === "name"
      ? value === null
        ? "<blank>"
        : CapitalizeFirstLetters(value)
      : key === "createdAt" || key === "updatedAt" || key === "lastLogin"
      ? DateTimeConverter(value)
      : value === null
      ? "<blank>"
      : value;
  };

  return { columns };
}
