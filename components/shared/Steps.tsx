import type { CSSProperties } from 'react';

export default function Steps({ style }: { style?: CSSProperties }) {
  return (
    <section style={style} className="wrap sec" data-slot="steps" />
  );
}
