import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function AuthCard({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-indigo-800 py-6 px-8 text-center">
          <div className="text-4xl mb-2">⌚</div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
