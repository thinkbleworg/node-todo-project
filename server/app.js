const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const taskRoutes = require('./routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger/swaggerDocs');

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
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Use task routes
app.use("/api/tasks", taskRoutes);

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// App listen to port 5000  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
