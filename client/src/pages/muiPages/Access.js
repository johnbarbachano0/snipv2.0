import React, { useState, useEffect, useRef } from "react";
import Alerts from "../../components/muiComponents/Alerts";
import { Box } from "@mui/material";
import { getUsers } from "../../api/api";
import Loading from "../../components/Loading";
import MainTable from "../../components/muiComponents/MainTable/MainTable";
import NavBar from "../../components/muiComponents/NavBar";
import ScrollToTop from "../../components/muiComponents/ScrollToTop";
import {
  Capitalize,
  CapitalizeFirstLetters,
} from "../../components/MiscJavascript";
import useAccessTable from "../../components/muiComponents/MainTable/useAccessTable";

const styles = {
  container: {
    margin: "auto",
    marginTop: 8,
    width: "95%",
  },
};

function Access() {
  const { columns, newData, isSuccess } = useAccessTable();
  const page = "access";
  const userObj = JSON.parse(sessionStorage.user);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [exportToggle, setExportToggle] = useState(false);
  const [pdfToggle, setPdfToggle] = useState(false);
  const searchValue = useRef("");

  useEffect(() => {
    const search = handleSearch(searchValue.current);
    return search;
  }, [isSuccess && newData]); // eslint-disable-line

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

  function handleSearch(searchVal) {
    searchValue.current = searchVal;
    setLoading(true);
    getUsers(searchVal, userObj.id)
      .then((results) => {
        const procResults = results.map((result) => {
          const processed = {
            ...result,
            provider: Capitalize(result.provider),
            name:
              result?.name === null ? "" : CapitalizeFirstLetters(result.name),
          };
          return processed;
        });
        setUsers(procResults);
        handleAlert("success", `Displaying ${results.length} result/s.`);
        setLoading(false);
      })
      .catch((error) => {
        handleAlert("error", "Getting users failed.");
        setLoading(false);
      });
  }

  function handleAlert(type, message) {
    setAlert({ type, message });
    setShowAlert(true);
  }

  function handleExport() {
    setExportToggle((prev) => !prev);
  }

  function handlePdf() {
    setPdfToggle((prev) => !prev);
  }

  return (
    <>
      <NavBar
        isLoading={loading}
        page={page}
        onSearch={(searchVal) => {
          handleSearch(searchVal);
        }}
        onExport={handleExport}
        onPdf={handlePdf}
      />
      {loading && (
        <Box className="center">
          <Loading type="cubes" color="#1DB9C3" height="10rem" width="10rem" />
        </Box>
      )}

      <Box sx={styles.container}>
        <MainTable
          loading={loading}
          rows={users}
          columns={columns}
          onExport={exportToggle}
          onPdf={pdfToggle}
          filename={Capitalize(page)}
        />
      </Box>
      {showAlert && (
        <Alerts
          type={alert.type}
          message={alert.message}
          closeAlert={() => setShowAlert(false)}
        />
      )}
      <ScrollToTop />
    </>
  );
}

export default Access;
