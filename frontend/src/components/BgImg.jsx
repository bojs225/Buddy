const BgImg = ({ children }) => {
  return (
    <div className="w-full min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center bg-blur-image"></div>
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
};

export default BgImg;
