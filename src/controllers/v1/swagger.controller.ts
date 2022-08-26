import { Router } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as SwaggerDefinition from '../../docs/swagger.json';

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(SwaggerDefinition, null, null, null));

export const SwaggerController: Router = router;
