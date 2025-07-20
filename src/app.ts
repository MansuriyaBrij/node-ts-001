import express from 'express';
// import routes from '#routes/auth.routes';
import routes from '#routes/index.routes';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});



export default app;