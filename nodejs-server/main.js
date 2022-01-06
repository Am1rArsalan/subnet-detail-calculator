const express = require("express");
const cors = require("cors");
const IpSubnetCalculator = require("./util");

const app = express();
app.use(cors());

app.post("/api", (req, res) => {
  console.log("data", IpSubnetCalculator);
  res.json({
    message: "success",
    data: [],
  });
});

app.listen(3001, () => {
  console.log("Example app listening on port 3001");
});
