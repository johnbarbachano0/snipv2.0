import React, { useState, useEffect } from "react";
import Alerts from "../../components/muiComponents/Alerts";
import { Box } from "@mui/system";
import DataTable from "../../components/muiComponents/DataTable";
import Loading from "../../components/Loading";
import NavBar from "../../components/muiComponents/NavBar";
import ScrollToTop from "../../components/muiComponents/ScrollToTop";
import { getHistory } from "../../api/api";

const styles = {
  container: {
    margin: "auto",
    marginTop: 8,
    width: "95%",
  },
};

function History() {
  const page = "history";
  const userObj = JSON.parse(sessionStorage.user);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setLoading(true);
    handleSearch("");
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
      .then((result) => {
        setHistory(result);
        handleAlert("success", `Displaying ${result.length} result/s.`);
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

  return (
    <>
      <NavBar
        isLoading={loading}
        page={page}
        onSearch={(searchVal) => {
          handleSearch(searchVal);
        }}
      />
      <Box sx={styles.container}>
        <DataTable loading={loading} rows={history} />
      </Box>

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
