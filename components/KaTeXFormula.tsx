'use client';

import React from 'react';
import katex from 'katex';

interface KaTeXFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function KaTeXFormula({ math, block = false, className = '' }: KaTeXFormulaProps) {
  try {
    const html = katex.renderToString(math, {
      displayMode: block,
      throwOnError: false,
    });

    return (
      <span
        className={`katex-rendered ${className} ${block ? 'block overflow-x-auto my-3 text-center py-2' : 'inline'}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (error) {
    return <code className="text-red-400 font-mono text-sm">{math}</code>;
  }
}
