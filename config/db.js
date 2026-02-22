const mongoose = require("mongoose");
const dns = require("dns");

const parseDnsServers = () => {
  const raw = process.env.DNS_SERVERS;
  if (!raw) return ["8.8.8.8", "1.1.1.1"];

  return raw
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);
};

const setDnsServers = (servers) => {
  if (!servers.length) return;

  try {
    dns.setServers(servers);
  } catch (err) {}
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("MONGODB_URI missing in .env");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    if (err.message.includes("querySrv ECONNREFUSED")) {
      setDnsServers(parseDnsServers());

      try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (retryErr) {
        console.log("MongoDB Connection Error:", retryErr.message);
        process.exit(1);
      }
    }

    console.log("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;