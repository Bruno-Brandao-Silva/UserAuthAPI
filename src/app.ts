import express from 'express';
import bodyParser from 'body-parser';
import UserRoute from './routes/User';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api/user', UserRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});