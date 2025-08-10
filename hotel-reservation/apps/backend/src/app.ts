import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/UserRoutes';

const app = express();
app.use(bodyParser.json());

app.use('/users', userRoutes);


export { app };


if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
