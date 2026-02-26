export default function CornerBrackets() {
  return (
    <>
      <div className="fixed top-4 left-4 hidden text-xl font-mono text-zinc-700 md:block">┌</div>
      <div className="fixed top-4 right-4 hidden text-xl font-mono text-zinc-700 md:block">┐</div>
      <div className="fixed bottom-4 left-4 hidden text-xl font-mono text-zinc-700 md:block">└</div>
      <div className="fixed bottom-4 right-4 hidden text-xl font-mono text-zinc-700 md:block">┘</div>
    </>
  );
}
