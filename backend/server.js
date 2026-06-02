const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { Server } = require('socket.io');
const passport = require('passport');
const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const expireJobs = require('./utils/expireJobs');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { protect } = require('./middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dotenv.config();
connectDB();
configurePassport();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
});
global.io = io;

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new Error('Unauthorized'));
    socket.userId = user._id.toString();
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  socket.join(socket.userId);
  socket.on('disconnect', () => {});
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

cron.schedule('0 * * * *', expireJobs);

const runAlertDigest = require('./utils/alertDigest');
cron.schedule('0 9 * * *', runAlertDigest);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
);
