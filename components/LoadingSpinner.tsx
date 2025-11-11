export default function LoadingSpinner() {
  return (
    <div className="flex gap-2 items-center justify-center h-screen">
      <div className="w-5 h-5 bg-linear-to-tr from-success to-default/70 rounded-full animate-bounce"></div>
      <div className="w-5 h-5 bg-linear-to-tr from-default/70 to-success rounded-full animate-bounce [animation-delay:0.1s]"></div>
      <div className="w-5 h-5 bg-linear-to-tr from-success to-default/70 rounded-full animate-bounce [animation-delay:0.2s]"></div>
    </div>
  );
}
