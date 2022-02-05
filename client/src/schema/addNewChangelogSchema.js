import * as yup from "yup";

export const addNewChangelogSchema = yup.object().shape({
  title: yup.string().required("Title is required.").max(50),
  changelog: yup.string().required("Changelog is required.").max(1000),
  DocumentStatusId: yup.number().required("Status is required."),
});
