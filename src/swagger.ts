import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application, Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vendor & Delivery Management API',
      version: '1.0.0',
      description: 'API documentation for vendor, delivery user, and transactions',
    },
    servers: [
      {
        url: 'https://online-food-app-backend.onrender.com', // adjust as per your port
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // path to your route files (adjust if needed)
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwaggerDocs = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at /api-docs');
};
