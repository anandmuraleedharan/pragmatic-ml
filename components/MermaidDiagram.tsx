'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  caption?: string;
  id?: string;
}

export function MermaidDiagram({ chart, caption, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          themeVariables: {
            darkMode: true,
            background: '#090d16',
            primaryColor: '#1e293b',
            primaryTextColor: '#f8fafc',
            primaryBorderColor: '#38bdf8',
            lineColor: '#64748b',
            secondaryColor: '#0f172a',
            tertiaryColor: '#1e293b',
          },
        });

        const uniqueId = `mermaid-${id || Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, chart);

        if (isMounted) {
          setSvgHtml(svg);
          setError(null);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setError(err?.message || 'Failed to render diagram');
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  return (
    <div className="my-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md">
      {error ? (
        <div className="p-4 text-xs font-mono text-amber-400 bg-amber-950/30 rounded border border-amber-800/40">
          <p className="font-semibold mb-1">Diagram Spec:</p>
          <pre className="overflow-x-auto">{chart}</pre>
        </div>
      ) : svgHtml ? (
        <div
          ref={containerRef}
          className="flex justify-center overflow-x-auto py-2 [&>svg]:max-w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      ) : (
        <div className="flex h-32 items-center justify-center text-slate-500 text-sm animate-pulse">
          Rendering architectural diagram...
        </div>
      )}
      {caption && (
        <p className="mt-3 text-center text-xs text-slate-400 italic tracking-wide border-t border-slate-900 pt-2">
          {caption}
        </p>
      )}
    </div>
  );
}
