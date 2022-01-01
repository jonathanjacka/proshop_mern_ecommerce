import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import colors from 'colors';
import morgan from 'morgan';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import pkg from 'cloudinary';
const cloudinary = pkg;

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://frozen-waters-85538.herokuapp.com/',
        ],
        styleSrc: [
          "'self'",
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css',
          'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap',
          "'unsafe-inline'",
        ],
        imgSrc: ["'self'", 'http://res.cloudinary.com/', 'data:'],
        fontSrc: ["'self'", 'https://*.com', 'data:'],
      },
    },
  })
);
app.use(xssClean());
app.use(mongoSanitize());
app.use(hpp());

// Restrict all routes to only 100 requests per IP address every 10 minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per IP
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use(limiter);

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

//Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running on in ${process.env.NODE_ENV} port ${PORT}: Hello there...`
      .bgBlue
  )
);
