const axios = require("axios");
require("dotenv").config();
const config = {
  withCredentials: true,
};

//Check username is available
export function isUsernameAvailable(username) {
  const url = `${process.env.REACT_APP_SERVER}/auth/username/${username}`;
  if (username.length > 3) {
    const isAuth = axios
      .get(url, config)
      .then((res) => {
        if (res.data == null) {
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
      if (error) {
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
      const user = res.data;
      sessionStorage.setItem("isAuth", JSON.stringify(true));
      sessionStorage.setItem("user", JSON.stringify(user));
      if (user.id) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      if (error) {
        console.log(error);
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return authUser;
}

//Logout User
export function logoutUser() {
  const url = `${process.env.REACT_APP_SERVER}/auth/logout`;
  axios.get(url, config).catch((error) => {
    console.log(error);
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
  const url = `${process.env.REACT_APP_SERVER}/pin/id/${id}`;
  const isDeleted = axios
    .delete(url, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      if (error) {
        window.location.href = `/error/${error.response.status}`;
      }
    });
  return isDeleted;
}

//Update Pin
export function patchPin(data) {
  const url = `${process.env.REACT_APP_SERVER}/pin/id/${data.PinId}`;
  const isUpdated = axios
    .patch(url, data, config)
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
  const url = `${process.env.REACT_APP_SERVER}/link/id/${data}`;
  const isDeleted = axios
    .delete(url, config)
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
  const url = `${process.env.REACT_APP_SERVER}/link/ids`;
  const isBulkDeleted = axios
    .delete(url, { data: data })
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
  const url = `${process.env.REACT_APP_SERVER}/link/id/${linkId}`;
  const isUpdated = axios
    .patch(url, data, config)
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
