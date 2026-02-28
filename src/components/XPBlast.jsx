import { useEffect } from "react";

const XPBlast = ({ message = "+5 XP for watering!", onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone?.();
    }, 750);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="xp-blast">
      <div className="xp-blast-content">
        🎉 {message}
      </div>
    </div>
  );
};

export default XPBlast;

