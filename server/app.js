const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger/swaggerDocs");
const authenticate = require("./middleware/authenticate");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Node server test code
// app.get('/',(req, res) => {
//     res.send('Hello World!');
// });

// Allow requests from React frontend running on localhost
app.use(cors());

// Use the express to parse the requests
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  }
};
connectDB();

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authenticate, taskRoutes);


// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// App listen to port 5000 only if its not a test env
// Supertest creates a server, so need not do this app.listen again
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = { app, connectDB };