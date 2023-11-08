// require('dotenv').config({ path: './env' });
import dotenv from 'dotenv';
import connectToDb from './db/index.js';
import { app } from './app.js';

dotenv.config({ path: './env' });

connectToDb()
  .then(() => {
    app.on('error', (error) => {
      console.log('Error :' + error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server started at port :${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('MONGO DB CONNECTION FAILED !!' + error);
  });

/*
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    app.on('error', (error) => {
      console.log('Error :' + error);
      throw error;
    });

    app.listen(`${process.env.PORT}`, () => {
      console.log(`App is listining on port : ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Error : ' + error);
    throw error;
  }
})();*/
