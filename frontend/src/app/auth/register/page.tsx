import RegisterForm from '@/components/auth/RegisterForm';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <Navbar />
      <RegisterForm />
    </div>
  );
}