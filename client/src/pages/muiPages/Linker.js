import React, { useState, useEffect } from "react";
import NavBar from "../../components/muiComponents/NavBar";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Container, IconButton, Link, Tooltip } from "@mui/material";
import { getLinks, bulkDeleteByLinkIds } from "../../api/api";
import AddNewLink from "../../components/muiComponents/AddNewLink";
import EditLink from "../../components/muiComponents/EditLink";
import Alerts from "../../components/muiComponents/Alerts";
import ConfirmModal from "../../components/muiComponents/ConfirmModal";
import CustomToolbar from "../../components/muiComponents/CustomToolbar";
import { getIcon } from "../../components/MiscJavascript";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { DateTimeConverter } from "../../components/MiscJavascript";
import { deleteByLinkId } from "../../api/api";

export default function Linker() {
  const userObj = JSON.parse(sessionStorage.user);
  const page = "links";
  const [rows, setRows] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [edit, setEdit] = useState();
  const [deleteId, setDeleteId] = useState(0);
  const [selectedDel, setSelectedDel] = useState([]);
  const [bulkDel, setBulkDel] = useState(false);
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      field: "site",
      headerName: "Link",
      renderCell: (params) => (
        <Link
          href={params.row.siteUrl}
          target="_blank"
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {params.row.title}
        </Link>
      ),
      sortComparator: (v1, v2, param1, param2) =>
        `${param1.api.getRow(param1.id).title}`.localeCompare(
          `${param2.api.getRow(param2.id).title}`
        ),
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      filterable: false,
    },
    {
      field: "siteUrl",
      headerName: "Site",
      hide: true,
      headerAlign: "center",
      minWidth: 250,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 400,
      headerAlign: "center",
    },
    {
      field: "tags",
      headerName: "Tags",
      headerAlign: "center",
      align: "center",
      minWidth: 350,
      renderCell: (params) => {
        return (
          <Box key={params.id}>
            {[...params.value].map((value) => (
              <Tooltip key={value} title={value}>
                <Chip
                  label={getIcon(value)}
                  sx={{
                    fontSize: 20,
                    padding: 0,
                    paddingTop: 0.7,
                    margin: 0.2,
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        );
      },
      sortComparator: (v1, v2, param1, param2) =>
        `${param1.api.getRow(param1.id).tags}`.localeCompare(
          `${param2.api.getRow(param2.id).tags}`
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      minWidth: 50,
      align: "center",
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        const isDisabled = userObj.id !== params.row.UserId;
        return (
          <Box key={params.id}>
            <Tooltip title="Delete">
              <span>
                <IconButton
                  onClick={() => {
                    setDeleteId(params.id);
                  }}
                  disabled={isDisabled}
                >
                  <DeleteRoundedIcon color={isDisabled ? "gray" : "error"} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Edit">
              <span>
                <IconButton
                  onClick={() => setEdit(params.row)}
                  disabled={isDisabled}
                >
                  <EditRoundedIcon color={isDisabled ? "gray" : "primary"} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 175,
      headerAlign: "center",
      align: "center",
      hide: true,
      renderCell: (params) => {
        return DateTimeConverter(params.row.createdAt);
      },
    },
    {
      field: "updatedAt",
      headerName: "Date Updated",
      width: 175,
      headerAlign: "center",
      align: "center",
      hide: true,
      renderCell: (params) => {
        return DateTimeConverter(params.row.updatedAt);
      },
    },
    {
      field: "User",
      headerName: "Created By",
      width: 150,
      headerAlign: "center",
      align: "center",
      hide: true,
      renderCell: (params) => {
        return params.row.User.username;
      },
      sortComparator: (v1, v2, param1, param2) =>
        `${param1.value.username}`.localeCompare(`${param2.value.username}`),
    },
  ];

  function handleAlert(type, message) {
    setAlert({ type, message });
    setShowAlert(true);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

  function handleSearch(searchVal) {
    getLinks(searchVal)
      .then((res) => {
        setRows(res);
        handleAlert("success", `Displaying ${res.length} results.`);
        setLoading(false);
      })
      .catch((error) => {
        handleAlert("error", "Getting links failed.");
      });
  }

  useEffect(() => {
    setLoading(true);
    handleSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated]);

  function handleDeleteYes() {
    setLoading(true);
    deleteByLinkId(deleteId).then((res) => {
      if (res) {
        handleAlert("success", "Link is deleted successfully!");
        setLoading(false);
        setDeleteId(0);
        setIsUpdated(!isUpdated);
      } else {
        handleAlert("error", "Error in link deletion.");
        setLoading(false);
        setDeleteId(0);
      }
    });
  }

  function handleSelectedDel(selectedDel) {
    setLoading(true);
    const data = { linkIds: selectedDel, userId: userObj.id };
    bulkDeleteByLinkIds(data).then((res) => {
      if (res) {
        handleAlert("success", "Bulk link deletion successful!");
        setLoading(false);
        setSelectedDel([]);
        setBulkDel(false);
        setIsUpdated(!isUpdated);
      } else {
        handleAlert("error", "Error in bulk link deletion.");
        setLoading(false);
        setSelectedDel([]);
        setBulkDel(false);
      }
    });
  }
  return (
    <>
      <NavBar
        page={page}
        onAdd={() => setShowAddNew(true)}
        isLoading={loading}
        onSearch={(searchVal) => {
          handleSearch(searchVal);
        }}
        addLabel={"Add New Link"}
      />
      <Container
        sx={{
          height: "85vh",
          width: "90vw",
          marginTop: 8,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection={true}
          disableSelectionOnClick
          loading={loading}
          rowHeight={40}
          components={{
            Toolbar: CustomToolbar,
          }}
          onSelectionModelChange={(ids) => setSelectedDel(ids)}
          componentsProps={{
            toolbar: {
              onSelectedDel: () => setBulkDel(true),
              disabled: selectedDel.length === 0 ? true : false,
              role: userObj.role,
            },
          }}
        />
      </Container>
      {showAlert && (
        <Alerts
          type={alert.type}
          message={alert.message}
          closeAlert={() => setShowAlert(false)}
        />
      )}
      {showAddNew && (
        <AddNewLink
          openModal={showAddNew}
          onAddNewLink={(type, message) => {
            handleAlert(type, message);
            setShowAddNew(false);
            setIsUpdated(!isUpdated);
          }}
          onAddNewCancel={() => setShowAddNew(false)}
        />
      )}
      {(deleteId !== 0 || bulkDel) && (
        <ConfirmModal
          action={bulkDel ? "Confirm bulk deletion?" : "Confirm delete?"}
          onClickCancel={() => {
            setDeleteId(0);
            setBulkDel(false);
          }}
          onClickYes={() => {
            deleteId !== 0 && handleDeleteYes();
            bulkDel && handleSelectedDel(selectedDel);
          }}
          confirmLoading={loading}
          openModal={deleteId !== 0 || bulkDel ? true : false}
        />
      )}

      {edit && (
        <EditLink
          openModal={edit ? true : false}
          onEditLink={(type, message) => {
            handleAlert(type, message);
            setEdit(false);
            setIsUpdated(!isUpdated);
          }}
          onEditCancel={() => setEdit()}
          linkData={edit}
        />
      )}
    </>
  );
}
