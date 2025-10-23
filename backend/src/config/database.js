import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

export async function connectDatabase(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  return mongoose.connection;
}
