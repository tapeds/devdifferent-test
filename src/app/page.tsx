'use client'

import withAuth from '@/components/withAuth';
import ClickableMap from '@/components/ClickableMap';

function Home() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-muted'>
      <ClickableMap />
    </div>
  );
}

export default withAuth(Home)
