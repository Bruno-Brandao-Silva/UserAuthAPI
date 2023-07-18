import express from 'express';
import bodyParser from 'body-parser';
import UserRoute from './routes/User';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use('/api/user', UserRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});