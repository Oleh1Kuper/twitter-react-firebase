'use client';

import usePosts from '@/modules/posts/hooks/use-posts';
import type { Post } from '@/types';

import PostCard from './components/post-card';

const DUMMY_POSTS: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 16',
    text: "Next.js 16 brings amazing new features including improved caching APIs, the new 'use cache' directive, and React 19.2 support. The Turbopack is now the default bundler and is stable for production use.\n\nI've been exploring these features and they significantly improve the developer experience.",
    photo:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    author: {
      name: 'John Doe',
      avatar: 'https://github.com/shadcn.png',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 42,
    dislikes: 3,
    comments: [
      {
        id: 'c1',
        author: {
          name: 'Jane Smith',
          avatar: 'https://i.pravatar.cc/150?u=jane',
        },
        text: "Great post! I've been waiting for Turbopack to become stable.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        likes: 12,
        dislikes: 0,
        subcomments: [
          {
            id: 'sc1',
            author: {
              name: 'John Doe',
              avatar: 'https://github.com/shadcn.png',
            },
            text: "Thanks! It's been a game changer for my workflow.",
            createdAt: new Date(Date.now() - 1000 * 60 * 15),
            likes: 5,
            dislikes: 0,
          },
          {
            id: 'sc2',
            author: {
              name: 'Alex Johnson',
              avatar: 'https://i.pravatar.cc/150?u=alex',
            },
            text: 'Same here! The build times are so much faster now.',
            createdAt: new Date(Date.now() - 1000 * 60 * 10),
            likes: 3,
            dislikes: 0,
          },
        ],
      },
      {
        id: 'c2',
        author: {
          name: 'Mike Wilson',
          avatar: 'https://i.pravatar.cc/150?u=mike',
        },
        text: 'The caching improvements are fantastic. Really simplifies data fetching.',
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
        likes: 8,
        dislikes: 1,
      },
    ],
  },
  {
    id: '2',
    title: 'Thoughts on Modern UI Design',
    text: "Minimalism continues to dominate modern UI design, but there's a growing trend towards adding subtle personality through micro-interactions and thoughtful typography choices.\n\nThe key is finding the balance between clean interfaces and engaging user experiences that don't feel sterile.",
    author: {
      name: 'Sarah Lee',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    likes: 89,
    dislikes: 7,
    comments: [
      {
        id: 'c3',
        author: {
          name: 'Chris Brown',
          avatar: 'https://i.pravatar.cc/150?u=chris',
        },
        text: 'I agree! Micro-interactions can really elevate a design without cluttering it.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        likes: 15,
        dislikes: 2,
        subcomments: [
          {
            id: 'sc3',
            author: {
              name: 'Sarah Lee',
              avatar: 'https://i.pravatar.cc/150?u=sarah',
            },
            text: 'Exactly! Small details make a big difference.',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
            likes: 7,
            dislikes: 0,
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Building Accessible Web Applications',
    text: "Accessibility isn't just a nice-to-have feature - it's essential for creating inclusive digital experiences. Here are some key practices I follow:\n\n- Use semantic HTML elements\n- Ensure proper color contrast\n- Add ARIA labels where needed\n- Test with screen readers\n- Support keyboard navigation",
    photo:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=400&fit=crop',
    author: {
      name: 'John Doe',
      avatar: 'https://github.com/shadcn.png',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    likes: 156,
    dislikes: 2,
    comments: [],
  },
];

const PostsModule = () => {
  const { posts } = usePosts();

  return (
    <section className="mx-auto max-w-200">
      <div className="grid grid-cols-2 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default PostsModule;
