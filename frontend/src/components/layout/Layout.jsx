import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
    <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
      &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
    </footer>
  </div>
);

export default Layout;
