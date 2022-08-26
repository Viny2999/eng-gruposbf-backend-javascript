import { Router } from 'express';
import { HealthCheckController } from './health-check.controller';
import { CurrencyConverterController } from './currency-converter.controller';
import { SwaggerController } from './swagger.controller';

const router = Router();

const defaultRoutes = [
  {
    path: '/health',
    route: HealthCheckController,
  },
  {
    path: '/converter',
    route: CurrencyConverterController,
  },
  {
    path: '/docs',
    route: SwaggerController,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export const Routes: Router = router;
