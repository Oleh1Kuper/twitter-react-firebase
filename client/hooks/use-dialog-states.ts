import { useState } from 'react';

const useDialogStates = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  return {
    open,
    isLoading,
    setOpen,
    setIsLoading,
  };
};

export default useDialogStates;
