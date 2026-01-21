import Services from '@/api';
import { useAuth } from '@/providers/auth-context-provider';
import { QUERY_KEYS } from '@/utils/query-keys';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const useMyInfo = () => {
  const { user } = useAuth();
  const { data, ...rest } = useQuery({
    queryKey: [QUERY_KEYS.MY_INFO, user?.uid],
    queryFn: async () => await Services.getMyInfo(user?.uid ?? ''),
  });

  const initials = useMemo(() => {
    if (!data?.displayName) return '';

    const [firstName, lastName] = data.displayName.split(' ');

    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }, [data]);

  return { myInfo: data, initials, ...rest };
};

export default useMyInfo;
