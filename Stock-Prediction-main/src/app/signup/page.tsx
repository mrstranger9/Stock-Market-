import SignUpForm from '@/components/auth/signup-form';
import { Bot } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
         <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2.5">
                <Bot className="h-10 w-10 text-primary" />
                <h1 className="text-3xl font-semibold whitespace-nowrap">QuantAxis AI</h1>
            </Link>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
