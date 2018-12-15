import * as express from "express";

const app: express.Express = express();

app.use("/public", express.static("public"));

app.get("*", (_req: express.Request, res: express.Response) => res.sendFile(__dirname + "/public/index.html"));

const port: number = +(process.env.PORT || 2500);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
