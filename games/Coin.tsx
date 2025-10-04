import React from 'react';

interface CoinProps {
  isFlipping: boolean;
  result: 'heads' | 'tails' | null;
}

const Coin: React.FC<CoinProps> = ({ isFlipping, result }) => {
  return (
    <div className="w-48 h-48 perspective">
      <div className={`coin ${isFlipping ? 'flipping' : ''} ${result ? result : ''}`}>
        <div className="side front">
          <span className="text-4xl font-bold">CARA</span>
        </div>
        <div className="side back">
          <span className="text-4xl font-bold">COROA</span>
        </div>
      </div>
    </div>
  );
};

// Add CSS to a style tag in the main HTML file if it can't be a separate file.
// For this project structure, let's inject it into the head
const coinCss = `
.perspective {
  perspective: 1000px;
}
.coin {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1s;
}
.coin.flipping {
  animation: flip 3s ease-out forwards;
}
.coin.heads {
  transform: rotateY(0deg);
}
.coin.tails {
  transform: rotateY(180deg);
}
.side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #facc15;
  color: #1f2937;
  border: 8px solid #ca8a04;
  box-shadow: 0 0 20px #facc15, inset 0 0 10px rgba(0,0,0,0.3);
}
.front {
  transform: rotateY(0deg);
}
.back {
  transform: rotateY(180deg);
}

@keyframes flip {
  0% { transform: rotateY(0); }
  100% { transform: rotateY(1800deg); }
}
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = coinCss;
document.head.appendChild(styleSheet);


export default Coin;