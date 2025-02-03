const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "A simple API for managing tasks using MongoDB",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/routes.js"], // Path to the API routes file
};

const swaggerDocs = swaggerJsdoc(options);
console.log("swagger Docs", swaggerDocs);

module.exports = swaggerDocs;
