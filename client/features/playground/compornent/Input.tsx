import { useEffect, useRef, useState } from 'react';

type Props = {
  defaultValue: string;
}

export const Input = (props: Props) => {
  const { defaultValue } = props;
  const [inputValue, setInputValue] = useState(defaultValue);
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  };

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, [inputValue]);

  return (
    <>
      <input
        style={{
          width: `${width}px`,
          margin: '0 0.5rem',
          padding: '0 0.5rem',
          textAlign: 'center',
          border: 'none',
          borderRadius: '0.5rem',
          overflow: 'hidden',
        }}
        type="text"
        defaultValue={defaultValue}
        onChange={handleChange}
        ref={inputRef}
      />
      <span style={{ position: 'absolute', padding: '0 0.5rem', color: '#0000' }} ref={ref}>
        {inputValue}
      </span>
    </>
  );
};
