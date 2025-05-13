import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function withAuth(Component: React.ComponentType) {
  return (props: any) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const { data: session } = await supabase.auth.getSession();

        if (session.session?.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }

        setIsLoading(false);
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return <></>;
    }

    if (isAuthenticated) {
      return <Component {...props} />;
    }

    return null;
  };
}

export default withAuth;
