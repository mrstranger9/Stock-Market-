'use client';
import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const publicPaths = ['/login', '/signup'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isPublic = publicPaths.includes(pathname);
      if (!user && !isPublic) {
        router.replace('/login');
      }
      if (user && isPublic) {
        router.replace('/');
      }
    }
  }, [user, isLoading, pathname, router]);

  const isPublic = publicPaths.includes(pathname);

  if (isLoading || (!user && !isPublic) || (user && isPublic)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
