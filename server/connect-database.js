const { Client } = require("cassandra-driver");

const astraClient = new Client({
    cloud: {
        secureConnectBundle: "./secure-connect-hacktoon.zip",
    },
    credentials: {
        username: process.env.astrausername,
        password: process.env.astrapassword,
    },
});

astraClient.connect(() => {
    console.log("Database connected!!");
});

module.exports = astraClient;
