import MainLayout from '@/components/layouts/main-layout';
import PostsModule from '@/modules/posts';

export default function Page() {
  return (
    <MainLayout>
      <PostsModule />
    </MainLayout>
  );
}
