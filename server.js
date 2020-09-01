const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');

const PORT = parseInt(process.env.PORT || '3000');

app.use(bodyParser.json());
app.use(cors());

//cors config

// const allowedOrigins = ['http://localhost:4200'];
// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     },
//     credentials: true,
// }));

const directoryPath = path.join(__dirname, './routes');
const files = fs.readdirSync(directoryPath);
files.forEach(f => {
  const route = require(directoryPath + `/${f}`);
  const posEnd = f.indexOf('.route.js');
  const name = f.substring(0, posEnd);
  app.use(`/${name}`, route);
});
console.log('Routes added.');

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    // API informations (required)
    title: 'Back End API', // Title (required)
    version: '0.0.1', // Version (required)
    description: 'APIs to access Back End', // Description (optional)
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['routes/*.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});