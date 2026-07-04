import 'dotenv/config'
import { createServer } from 'http';
import App from "./Src/App.js";
import { connectToDatabase } from './Src/Config/connectToDB.js';
import { initSocket } from './Src/Sockets/index.js';

const startServer = async () => {
  try {
    await connectToDatabase();
    const PORT = 3000;
    const httpServer = createServer(App);
    
    // Initialize Socket.io server
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database connection error:", error);
    process.exit(1);
  }
};

startServer();