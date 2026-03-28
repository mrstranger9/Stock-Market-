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
import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';

const formSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: 'John Doe', email: 'john.doe@example.com', password: 'password', confirmPassword: 'password' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      
      const { user } = userCredential;

      // Store user profile in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userProfileData = {
          uid: user.uid,
          name: values.name,
          email: values.email,
          createdAt: serverTimestamp(),
          role: 'user'
      };

      setDoc(userDocRef, userProfileData)
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userProfileData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: 'Account Created!',
        description: 'You have been successfully signed up. You can now log in.',
      });
      router.push('/login');

    } catch (error: any) {
      console.error('Account Creation Error:', error);
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email address is already in use. Please log in instead.';
      }
      toast({
        variant: 'destructive',
        title: 'Account Creation Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Create the demo account with the pre-filled details. After creating the account, you will be redirected to the login page.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
              </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
          <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/login">Log in</Link>
              </Button>
          </p>
      </CardFooter>
    </Card>
  );
}
