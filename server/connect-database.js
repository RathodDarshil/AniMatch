const { Client } = require("cassandra-driver");

const astraClient = new Client({
    cloud: {
        secureConnectBundle: "./secure-connect-hacktoon.zip",
    },
    credentials: {
        username: process.env.username,
        password: process.env.password,
    },
});

astraClient.connect(() => {
    console.log("Database connected!!");
});

module.exports = astraClient;
