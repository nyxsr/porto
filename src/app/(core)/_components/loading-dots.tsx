export const LoadingDots = () => {
  return (
    <div className='flex items-center gap-1'>
      <div className='h-[5px] w-[5px] animate-pulse rounded-full bg-gray-500 delay-75'></div>
      <div className='h-[5px] w-[5px] animate-pulse rounded-full bg-gray-500 delay-150'></div>
      <div className='h-[5px] w-[5px] animate-pulse rounded-full bg-gray-500 delay-225'></div>
    </div>
  );
};
