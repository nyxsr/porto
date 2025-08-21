import Sidebar from './_components/sidebar';

export default function CoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex h-screen max-h-screen w-screen overflow-hidden'>
      {/* <Sidebar /> */}
      <main className='flex-1'>{children}</main>
    </div>
  );
}
