export const Goal = () => {
  const goal = {
    x: 590,
    y: 510,
    width: 50,
    height: 50,
  };

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
