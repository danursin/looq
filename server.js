const express = require("express");
const app = express();
const public = __dirname + "/build";

app.use(express.static(public));
app.get("/", (_req, res) => res.render("index"));

const port = process.env.PORT || 2500;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
