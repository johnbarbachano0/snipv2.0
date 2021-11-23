import * as yup from "yup";
import { isUsernameAvailable } from "../api/api";

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required.")
    .min(4, "Username must be at least 4 characters.")
    .test(
      "is-username-available",
      "Username already in use.",
      async (username) => {
        if (username) {
          const res = await isUsernameAvailable(username);
          return res;
        }
      }
    ),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters.")
    .test(
      "isValidPass",
      "Password must have at least one uppercase character, one number and one symbol.",
      (value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSymbole = /[!@#%&]/.test(value);
        var validConditions = 0;
        const numberOfMustBeValidConditions = 3;
        const conditions = [hasUpperCase, hasNumber, hasSymbole];
        conditions.forEach((condition) => condition && validConditions++);
        if (validConditions >= numberOfMustBeValidConditions) {
          return true;
        }
        return false;
      }
    ),
  repassword: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password"), null], "Passwords do not match."),
});

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required.")
    .min(4, "Username must be at least 4 characters.")
    .test("is-username-exist", "Username does not exist.", async (username) => {
      if (username) {
        const res = await isUsernameAvailable(username);
        return !res;
      }
    }),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
});
