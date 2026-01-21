import Services from '@/api';
import { QUERY_KEYS } from '@/utils/query-keys';
import { useQuery } from '@tanstack/react-query';

const usePosts = () => {
  const { data, ...rest } = useQuery({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: Services.getPosts,
  });

  return { posts: data ?? [], ...rest };
};

export default usePosts;
