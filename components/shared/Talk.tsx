import type { CSSProperties } from 'react';

export default function Talk({ style }: { style?: CSSProperties }) {
  return (
    <section style={style} className="wrap" data-slot="talk" />
  );
}
