import type { ReactNode } from 'react';

type Props = {
  x?: '|..' | '.|.' | '..|';
  y?: '/..' | './.' | '../';
  dir?: '-' | '|';
};

export const AlignBox = ({
  x = '.|.',
  y = './.',
  dir = '-',
  children,
}: Props & { children: ReactNode }) => {
  const justifyContent = { '|..': 'flex-start', '.|.': 'center', '..|': 'flex-end' }[x];
  const alignItems = { '/..': 'flex-start', './.': 'center', '../': 'flex-end' }[y];
  const flexDirection = ({ '-': 'row', '|': 'column' } as const)[dir];
  return (
    <div
      style={{
        display: 'flex',
        flexDirection,
        alignItems,
        justifyContent,
      }}
    >
      {children}
    </div>
  );
};
