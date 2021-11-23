import * as yup from "yup";

export const addNewCommentSchema = yup.object().shape({
  commentBody: yup
    .string()
    .required("Comment is required.")
    .max(250, "Comment must include less than 250 characters."),
});
