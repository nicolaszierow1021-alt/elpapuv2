import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProfileSettings } from './ProfileSettings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Perfil | PAPUMOVIE',
};

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex justify-center py-10 px-4 min-h-[80vh]">
        <div className="w-full max-w-4xl">
          <ProfileSettings />
        </div>
      </main>
      <Footer />
    </>
  );
}
