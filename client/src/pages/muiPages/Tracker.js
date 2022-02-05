import React, { useState, useEffect, useRef } from "react";
import Alerts from "../../components/muiComponents/Alerts";
import { Box } from "@mui/material";
import { getChangelogs, patchChangelog } from "../../api/api";
import Loading from "../../components/Loading";
import MainTable from "../../components/muiComponents/MainTable/MainTable";
import NavBar from "../../components/muiComponents/NavBar";
import ScrollToTop from "../../components/muiComponents/ScrollToTop";
import { Capitalize } from "../../components/MiscJavascript";
import useTrackerTable from "../../components/muiComponents/MainTable/useTrackerTable";
import NewChangelog from "../../components/muiComponents/NewChangelog";
import ConfirmModal from "../../components/muiComponents/ConfirmModal";

const styles = {
  container: {
    margin: "auto",
    marginTop: 8,
    width: "95%",
  },
};

function Tracker() {
  const [isFirstRun, setIsFirstRun] = useState(true);
  const { columns, deleteData, setDeleteData, editData, setEditData } =
    useTrackerTable();
  const page = "tracker";
  const userObj = JSON.parse(sessionStorage.user);
  const [loading, setLoading] = useState(true);
  const [changelogs, setChangelogs] = useState([]);
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [exportToggle, setExportToggle] = useState(false);
  const [pdfToggle, setPdfToggle] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showModal, setModal] = useState(false);
  const [defaultVal, setDefaultVal] = useState({ type: "new" });
  const searchValue = useRef("");

  useEffect(() => {
    setIsFirstRun(false);
  }, []);

  useEffect(() => {
    const search = handleSearch(searchValue.current);
    return search;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    deleteData && setModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteData]);

  useEffect(() => {
    const unsubscribe = checkUnsubmittedChangelogs();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isFirstRun && (editData?.title || editData?.description)) {
      setDefaultVal({ ...editData, type: "edit" });
      setShowAdd(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [showAlert]);

  const checkUnsubmittedChangelogs = () => {
    const changelogData = JSON?.parse(localStorage?.getItem("changelogData"));
    if (changelogData?.title || changelogData?.changelog) {
      setDefaultVal((prev) => ({ ...prev, ...changelogData }));
      setShowAdd(true);
    }
  };

  const handleSearch = (searchVal) => {
    searchValue.current = searchVal;
    setLoading(true);
    getChangelogs(searchVal, userObj.id)
      .then((results) => {
        setChangelogs(results);
        handleAlert("success", `Displaying ${results?.length} result/s.`);
        setLoading(false);
      })
      .catch((error) => {
        handleAlert("error", "Getting changelogs failed.");
        setLoading(false);
      });
  };

  const handleAlert = (type, message) => {
    setAlert({ type, message });
    setShowAlert(true);
  };

  const handleExport = () => {
    setExportToggle((prev) => !prev);
  };

  const handlePdf = () => {
    setPdfToggle((prev) => !prev);
  };

  const handleAdd = (type, message) => {
    setDefaultVal({ type: "new" });
    setEditData(null);
    setShowAdd(false);
    setShowAlert(type, message);
    handleSearch("");
  };

  const handleNavbarAdd = () => {
    setShowAdd(true);
  };

  const handleChangelogDelete = () => {
    setLoading(true);
    patchChangelog({ id: deleteData, status: false })
      .then((res) => {
        if (res) {
          handleAlert("success", "Deleted changelog successfully.");
        } else {
          handleAlert("error", "Error during deletion. Try again.");
        }
        setLoading(false);
        setModal(false);
        setDeleteData(null);
        return res;
      })
      .then((res) => {
        if (res) handleSearch("");
      });
  };

  const handleConfirmCancel = () => {
    setModal(false);
    setDeleteData(null);
  };

  const handleNewChangelogCancel = () => {
    setShowAdd(false);
    setDefaultVal({ type: "new" });
    setEditData(null);
  };

  return (
    <>
      <NavBar
        isLoading={loading}
        page={page}
        onSearch={(searchVal) => handleSearch(searchVal)}
        onExport={handleExport}
        onPdf={handlePdf}
        onAdd={handleNavbarAdd}
      />

      {loading && (
        <Box className="center">
          <Loading
            type="spinningBubbles"
            color="#1DB9C3"
            height="10rem"
            width="10rem"
          />
        </Box>
      )}

      <Box sx={styles.container}>
        <MainTable
          loading={loading}
          rows={changelogs}
          columns={columns}
          onExport={exportToggle}
          onPdf={pdfToggle}
          filename={Capitalize(page)}
        />
      </Box>

      {showAdd && (
        <NewChangelog
          type={defaultVal.type}
          onCancel={handleNewChangelogCancel}
          openModal={showAdd}
          onAdd={(type, message) => handleAdd(type, message)}
          defaultVal={defaultVal}
        />
      )}

      {showModal && (
        <ConfirmModal
          action="Confirm delete?"
          onClickCancel={() => handleConfirmCancel()}
          onClickYes={handleChangelogDelete}
          confirmLoading={loading}
          openModal={showModal}
        />
      )}

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

export default Tracker;
