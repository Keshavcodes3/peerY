import 'dotenv/config'

import App from "./Src/App.js";
import { connectToDatabase } from './Src/Config/connectToDB.js';

const startServer = async () => {
  try {
    await connectToDatabase();
    const PORT = 3000;
    App.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database connection error:", error);
    process.exit(1);
  }
};

startServer();