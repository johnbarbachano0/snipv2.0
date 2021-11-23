require("dotenv").config();
const bcrypt = require("bcrypt");
const { AuditTrail } = require("../models");

async function genHash(myPlaintextPassword) {
  const hash = await bcrypt.hash(myPlaintextPassword, 10).catch((err) => {
    return err;
  });
  return hash;
}

function validPassword(password, hash) {
  const isValid = bcrypt.compare(password, hash);
  return isValid;
}

function createResponse(type, msg) {
  const NewResponse = {
    type: type,
    message: msg,
  };
  return NewResponse;
}

function createTrail(action, msg, prevValue, newValue, UserId, errorMsg) {
  const newTrail = {
    action: action,
    message: msg,
    prevValue: prevValue,
    newValue: newValue,
    UserId: UserId,
    error: errorMsg,
  };
  AuditTrail.create(newTrail).catch((error) => {
    console.log(error);
  });
}

module.exports = {
  validPassword,
  genHash,
  createResponse,
  createTrail,
};
