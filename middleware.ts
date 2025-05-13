import { NextResponse } from 'next/server';
import { supabase } from './src/lib/supabase';

export async function middleware(req: Request) {
  const { data: session } = await supabase.auth.getSession();

  if (session.session?.user) {
    return NextResponse.next();
  } else {
    const url = new URL(req.url);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}
