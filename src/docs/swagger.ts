import * as dotenv from 'dotenv';
dotenv.config();

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    description: 'Swagger Documentation',
    version: '1.0.0',
    title: 'Grupo SBF Backend Challenge'
  },
  servers: [{ url: `${process.env.URL}/v1` }],
  host: `${process.env.URL}`,
  basePath: '/v1',
  paths: {
    '/converter/{value}/{currency}': {
      get: {
        tags: [
          'Currency Converter'
        ],
        produces: ['application/json'],
        parameters: [
          {
            name: 'value',
            in: 'path',
            description: 'The Value of Product',
            required: true,
            type: 'number'
          },
          {
            name: 'currency',
            in: 'path',
            description: 'The Monetary Unit of a Country',
            required: true,
            type: 'string'
          }
        ],
        responses: {
          200: {
            description: 'Successful Operation',
            schema: {
              type: 'array'
            }
          }
        }
      }
    }
  },
  definitions: {},
  components: {}
};

export const SwaggerDefinition = swaggerDef;
