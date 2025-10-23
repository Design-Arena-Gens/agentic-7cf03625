import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import networkRoutes from './routes/network.routes.js';
import payoutRoutes from './routes/payout.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { errorHandler } from './middlewares/error-handler.js';
import { authenticate } from './middlewares/authenticate.js';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(',') || '*',
    credentials: true,
  })
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', authenticate, productRoutes);
app.use('/api/orders', authenticate, orderRoutes);
app.use('/api/network', authenticate, networkRoutes);
app.use('/api/payouts', authenticate, payoutRoutes);
app.use('/api/notifications', authenticate, notificationRoutes);

app.use(errorHandler);

export default app;
