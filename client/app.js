const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 4007;
app.listen(port, () => {
  console.log(`Listening at port http://localhost:${port}`);
});
