import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to demo page for local preview
  redirect('/demo');
}
