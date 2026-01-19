import Services from '@/api';
import { useAuth } from '@/providers/auth-context-provider';
import { USERS } from '@/utils/query-keys';
import { useQuery } from '@tanstack/react-query';

const useMyInfo = () => {
  const { user } = useAuth();
  const { data, ...rest } = useQuery({
    queryKey: [USERS.MY_INFO, user?.uid],
    queryFn: async () => await Services.getMyInfo(user?.uid ?? ''),
  });

  return { myInfo: data, ...rest };
};

export default useMyInfo;
