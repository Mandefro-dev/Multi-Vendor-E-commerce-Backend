import "dotenv/config";

import app from "./app";
import { prisma } from "./config/prisma";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("DATABSE CONNECTED SUCCESSFULLY");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("dfailed to connect to database");
    console.log(error);
    process.exit(1);
  }
}
startServer();
