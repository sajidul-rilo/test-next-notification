import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Link href="/live-chat" className="bg-slate-500 px-2 py-1 rounded-lg">
        Chat
      </Link>
    </div>
  );
}
