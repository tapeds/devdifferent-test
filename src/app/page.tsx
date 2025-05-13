'use client'

import withAuth from '@/components/hoc/withAuth';
import ClickableMap from '@/components/map/ClickableMap';

function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-muted'>
      <h1 className="text-3xl font-bold text-center mb-6 text-foreground">
        Explore Properties on the Map
      </h1>
      <ClickableMap />
    </div>
  );
}

export default withAuth(Home)
