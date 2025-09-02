import LoginForm from '@/components/auth/LoginForm';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <LoginForm />
    </div>
  );
}