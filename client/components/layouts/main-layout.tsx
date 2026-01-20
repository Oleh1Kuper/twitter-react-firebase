import React from 'react';

import Header from './header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className='px-6 py-4'>{children}</main>
    </>
  );
};

export default MainLayout;
