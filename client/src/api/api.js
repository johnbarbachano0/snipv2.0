require("dotenv").config();
const axios = require("axios");
const config = {
  withCredentials: true,
};
const getHeader = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: sessionStorage.getItem("sessionId"),
    },
  };
};

//Check username is available
export function isUsernameAvailable(username) {
  if (username.length > 3) {
    let url = `${process.env.REACT_APP_SERVER}/auth/username/${username}`;
    const isAuth = axios
      .get(url, config)
      .then((res) => {
        if (res?.data === null) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        if (error) {
          window.location.href = `/error/${error.response.status}`;
        }
      });
    return isAuth;
  }
}

//Register User
export function postNewUser(data) {
  const url = `${process.env.REACT_APP_SERVER}/auth/register`;
  const createdUser = axios
    .post(url, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error.response) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return createdUser;
}

//Login User
export function authenticateUser(data) {
  const url = `${process.env.REACT_APP_SERVER}/auth/login`;
  const authUser = axios
    .post(url, data, config)
    .then((res) => {
      const user = res.data.user;
      const session = res.data.session;
      const sessionId = res.data.sessionId;
      sessionStorage.setItem("isAuth", JSON.stringify(true));
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("session", JSON.stringify(session));
      sessionStorage.setItem("sessionId", sessionId);
      if (user?.id) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return authUser;
}

//Logout User
export function logoutUser(userId) {
  const url = `${process.env.REACT_APP_SERVER}/auth/logout/${userId}`;
  axios
    .get(url, config)
    .then((res) => {
      if (res?.data?.id === null) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
}

//Get All Pins
//Commented out after implementing better search (Get Pins by Search)
// export function getAllPins() {
//   const url = `${process.env.REACT_APP_SERVER}/pin`;
//   const pins = axios
//     .get(url, config)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((error) => {
//       if (error) {
//         window.location.href = `/error/${error.response.status}`;
//       }
//     });
//   return pins;
// }

//Get Pins by Search
export function getSearchPins(searchVal) {
  const url = `${process.env.REACT_APP_SERVER}/pin/search?query=${searchVal}`;
  const pins = axios
    .get(url, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return pins;
}

//Get Pin By Id
export function getPinById(id) {
  const url = `${process.env.REACT_APP_SERVER}/pin/id/${id}`;
  const pins = axios
    .get(url, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return pins;
}

//Post New Pin
export function postNewPin(data) {
  const url = `${process.env.REACT_APP_SERVER}/pin`;
  const newPin = axios
    .post(url, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return newPin;
}

//Delete Pin by Id
export function deletePinById(id) {
  const header = getHeader();
  const url = `${process.env.REACT_APP_SERVER}/pin/id/${id}`;
  const isDeleted = axios
    .delete(url, header)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return isDeleted;
}

//Update Pin
export function patchPin(data) {
  const header = getHeader();
  const url = `${process.env.REACT_APP_SERVER}/pin/id/${data.PinId}`;
  const isUpdated = axios
    .patch(url, { data: data, ...header })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return isUpdated;
}

//Get Comment by PinId
export function getCommentByPinId(id) {
  const url = `${process.env.REACT_APP_SERVER}/comment/${id}`;
  const comment = axios
    .get(url, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return comment;
}

//Add New Comment
export function postCommentByPinId(data) {
  const url = `${process.env.REACT_APP_SERVER}/comment`;
  const comment = axios
    .post(url, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return comment;
}

//Get Links by Page No.
export function getAllLinks(no) {
  const url = `${process.env.REACT_APP_SERVER}/link/page/${no}`;
  const links = axios
    .get(url, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return links;
}

// Get All Links
export function getLinks(searchVal) {
  const url = `${process.env.REACT_APP_SERVER}/link/search?query=${searchVal}`;
  const links = axios
    .get(url, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return links;
}

//Post New Link
export function postNewLink(data) {
  const url = `${process.env.REACT_APP_SERVER}/link`;
  const links = axios
    .post(url, data, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return links;
}

//Delete by Link Id
export function deleteByLinkId(data) {
  const header = getHeader();
  const url = `${process.env.REACT_APP_SERVER}/link/id/${data}`;
  const isDeleted = axios
    .delete(url, header)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return isDeleted;
}

//Bulk Delete by Link Ids
export function bulkDeleteByLinkIds(data) {
  const header = getHeader();
  const url = `${process.env.REACT_APP_SERVER}/link/ids`;
  const isBulkDeleted = axios
    .delete(url, { data: data, ...header })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return isBulkDeleted;
}

//Patch by Link Id
export function patchLinkById(data, linkId) {
  const header = getHeader();
  const url = `${process.env.REACT_APP_SERVER}/link/id/${linkId}`;
  const isUpdated = axios
    .patch(url, { data: data, ...header })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return isUpdated;
}
