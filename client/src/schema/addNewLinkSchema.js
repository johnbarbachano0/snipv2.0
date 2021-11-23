import * as yup from "yup";

export const addNewLinkSchema = yup.object().shape({
  title: yup.string().required("Title is required.").max(100),
  description: yup.string().required("Site Description is required.").max(255),
  siteUrl: yup
    .string()
    .required("Website is required.")
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^((https:)\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "URL is not valid."
    ),
});
