export function TextDivider({ text }: { text: string }) {
  return (
    <div className="flex w-full items-center rounded-full">
      <div className="flex-1 border-b border-gray-300"></div>
      <span className="px-8 py-3 text-lg font-semibold capitalize text-zinc-800">
        {text}
      </span>
      <div className="flex-1 border-b border-gray-300"></div>
    </div>
  );
}
