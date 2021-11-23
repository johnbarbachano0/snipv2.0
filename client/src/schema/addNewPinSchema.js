import * as yup from "yup";

export const addNewPinSchema = yup.object().shape({
  title: yup.string().required("Title is required.").max(100),
  description: yup.string().required("Description is required.").max(2000),
});
