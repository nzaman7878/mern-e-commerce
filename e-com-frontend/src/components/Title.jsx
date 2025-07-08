

const Title = ({ text1, text2 }) => {
  return (
    <div className='flex flex-wrap justify-center items-center gap-2 mb-3'>
      <p className='text-gray-500 text-base sm:text-lg'>
        {text1}{' '}
        <span className='text-gray-700 font-medium'>{text2}</span>
      </p>
      <p className='w-8 sm:w-12 h-[2px] bg-gray-700'></p>
    </div>
  );
};

export default Title;
