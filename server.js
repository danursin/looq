"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.use("/public", express.static("public"));
app.get("*", (_req, res) => res.sendFile(__dirname + "/public/index.html"));
const port = +(process.env.PORT || 2500);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
//# sourceMappingURL=server.js.map