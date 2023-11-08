import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectToDb = async () => {
  try {
    const connectionInstanse = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\n Mongo DB Connected!! DB HOST: ${connectionInstanse.connection.host}`
    );
  } catch (error) {
    console.log(`Mongo Connection Error :${error}`);
    process.exit(1);
  }
};

export default connectToDb;
