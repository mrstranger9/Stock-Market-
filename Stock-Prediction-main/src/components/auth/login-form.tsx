'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { ToastAction } from '../ui/toast';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'john.doe@example.com',
      password: 'password',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: 'Login Successful',
        description: "Welcome back! You're now logged in.",
      });
      router.push('/');
    } catch (error: any) {
      console.error('Login Error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid credentials. Please create the demo account first.',
            action: <ToastAction asChild altText="Sign Up"><Link href="/signup">Sign Up</Link></ToastAction>,
        });
      } else {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>To use the demo, you must first create the account on the sign-up page. Then, return here to log in.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
                <Button variant="link" size="sm" asChild className="p-0 h-auto">
                    <Link href="#">Forgot Password?</Link>
                </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/signup">Create one now</Link>
            </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
