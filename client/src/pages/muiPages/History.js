import React, { useState, useEffect } from "react";
import Alerts from "../../components/muiComponents/Alerts";
import { Box } from "@mui/system";
import { getHistory } from "../../api/api";
import Loading from "../../components/Loading";
import MainTable from "../../components/muiComponents/MainTable/MainTable";
import NavBar from "../../components/muiComponents/NavBar";
import ScrollToTop from "../../components/muiComponents/ScrollToTop";
import useHistoryTable from "../../components/muiComponents/MainTable/useHistoryTable";
import { Capitalize } from "../../components/MiscJavascript";
const styles = {
  container: {
    margin: "auto",
    marginTop: 8,
    width: "95%",
  },
};

function History() {
  const { columns } = useHistoryTable();
  const page = "history";
  const userObj = JSON.parse(sessionStorage.user);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [exportToggle, setExportToggle] = useState(false);
  const [pdfToggle, setPdfToggle] = useState(false);

  useEffect(() => {
    const search = handleSearch("");
    return search;
  }, []); // eslint-disable-line

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

  function handleSearch(searchVal) {
    setLoading(true);
    getHistory(searchVal, userObj.id)
      .then((results) => {
        const procResults = results.map((result) => {
          const processed = {
            ...result,
            username: result.User.username,
          };
          return processed;
        });
        setHistory(procResults);
        handleAlert("success", `Displaying ${results.length} result/s.`);
        setLoading(false);
      })
      .catch((error) => {
        handleAlert("error", "Getting history failed.");
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
      {!loading && (
        <Box sx={styles.container}>
          <MainTable
            loading={loading}
            rows={history}
            columns={columns}
            onExport={exportToggle}
            onPdf={pdfToggle}
            filename={Capitalize(page)}
          />
        </Box>
      )}
      {showAlert && (
        <Alerts
          type={alert.type}
          message={alert.message}
          closeAlert={() => setShowAlert(false)}
        />
      )}
      {loading && (
        <Box className="center">
          <Loading type="cubes" color="#1DB9C3" height="10rem" width="10rem" />
        </Box>
      )}
      <ScrollToTop />
    </>
  );
}

export default History;
