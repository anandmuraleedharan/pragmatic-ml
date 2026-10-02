import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'PragmaticML | The Anti-LLM Playbook for Principal ML Engineers',
  description:
    'Comprehensive conceptual study guide and architectural reference for right-sized machine learning. Master classical algorithms, graph models, sparse representations, and deep neural architectures that beat LLMs on cost, latency, and determinism.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060911] text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950 py-10 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4">
            <p>
              PragmaticML — Built by Anand Muraleedharan for mastering right-sized, zero-cost, high-performance machine learning.
            </p>
            <p className="mt-2 text-slate-600">
              No LLMs were wasted computing dot products, distances, or graph paths in this project.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
