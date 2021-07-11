const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const api_routes = require("./Routes/index");
const app = express();
const astraClient = require("./connect-database");
// const { Client } = require("cassandra-driver");

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));
app.use(bodyParser.text({ limit: "5mb" }));
app.use(bodyParser.raw({ limit: "5mb" }));

app.use("/", api_routes);

// const astraClient = new Client({
//     cloud: {
//         secureConnectBundle: "./secure-connect-hacktoon.zip",
//     },
//     credentials: {
//         username: process.env.username,
//         password: process.env.password,
//     },
// });

// astraClient.connect(() => {
//     console.log("Database connected!!");
// });

var server_listing = app.listen(process.env.PORT, function () {
    console.log("Server listening on port " + process.env.PORT);
});

module.exports = app;
// module.exports = astraClient;
