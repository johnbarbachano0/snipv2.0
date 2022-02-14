require("dotenv").config();

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const { statusCode } = res;
  if (error?.name === "InternalOAuthError") {
    res.redirect("/auth/login/error");
  } else if (statusCode.toString().charAt(0) === "4") {
    res.send(error);
    // res.redirect(`${process.env.REACT_APP_CLIENT}/error/${statusCode}`);
  } else {
    res.send(error);
    // res.redirect(`${process.env.REACT_APP_CLIENT}/error/500`);
  }
  // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // res.status(statusCode);
  // res.json({
  //   message: error.message,
  //   stack: process.env.NODE_ENV === "production" ? "Production" : error.stack,
  // });
};

module.exports = { notFound, errorHandler };
