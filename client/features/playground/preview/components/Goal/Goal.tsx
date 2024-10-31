import { goal } from '../../constants';

export const Goal = () => {
  return (
    <div
      style={{
        position: 'absolute',
        left: goal.x,
        top: goal.y,
        width: goal.width,
        height: goal.height,
        backgroundColor: 'green',
        border: '2px solid darkgreen',
        opacity: 0.5,
      }}
    />
  );
};
