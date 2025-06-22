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
        url: 'https://online-food-app-backend.onrender.com', // prod
      },
      {
        url: 'http://localhost:8080', // dev
      }
    ],
  },
  apis: [process.env.NODE_ENV === 'production' ? './dist/routes/**/*.js' : './src/routes/**/*.ts'],
};


const swaggerSpec = swaggerJsdoc(options);

export const setupSwaggerDocs = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at /api-docs');
};
