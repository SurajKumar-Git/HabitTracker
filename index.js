import express from "express";
import routes from "./routes/index.js";
import "./config/mongoose.js";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
const app = express();
const port = 3000;

// Url Encoded middleware for parsing post requests
app.use(express.urlencoded({ extended: false }));

// parse JSON data in request object
app.use(express.json());

// Setting view engine
app.set("view engine", "ejs");
app.use(expressEjsLayouts);

// Extract style and scripts from sub pages into the layouts
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// Setting views folder, assests
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static("assests"));

// use express router
app.use("/", routes);

app.listen(port, () => {
  console.log("Server started on port: ", port);
});
