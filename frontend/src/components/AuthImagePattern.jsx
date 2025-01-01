const AuthImagePattern = ({ title, subtitle }) => {
  return (
    // <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
    //   <div className="max-w-md text-center">
    //     <div className="grid grid-cols-3 gap-3 mb-8">
    //       {[...Array(9)].map((_, i) => (
    //         <div
    //           key={i}
    //           className={`aspect-square rounded-2xl bg-primary/10 ${
    //             i % 2 === 0 ? "animate-pulse" : ""
    //           }`}
    //         />
    //       ))}
    //     </div>
    //     <h2 className="text-2xl font-bold mb-4">{title}</h2>
    //     <p className="text-base-content/60">{subtitle}</p>
    //   </div>
    // </div>
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
  <div className="max-w-md text-center">
    <div className="grid grid-cols-4 gap-4 mb-8">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`aspect-square rounded-lg ${
            i % 3 === 0 ? "bg-primary/20 animate-bounce" : "bg-secondary/20"
          }`}
        />
      ))}
    </div>
    <h2 className="text-3xl font-semibold mb-4">{title}</h2>
    <p className="text-base-content/70 italic">{subtitle}</p>
  </div>
</div>

  );
};

export default AuthImagePattern;
