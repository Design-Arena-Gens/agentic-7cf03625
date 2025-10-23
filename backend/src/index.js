import dotenv from 'dotenv';
import app from './server.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await connectDatabase();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`NetWeave Pro API listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});
