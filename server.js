import express, { static } from "express";
const app = express();
const public = __dirname + "/build";

app.use(static(public));
app.get("*", (_req, res) => res.sendFile(`${public}/index.html`));

const port = process.env.PORT || 2500;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
