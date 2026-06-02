import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-8xl font-bold text-gray-200">404</h1>
    <h2 className="text-2xl font-semibold text-gray-700 mt-4">Page not found</h2>
    <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary mt-6">Go home</Link>
  </div>
);

export default NotFound;
