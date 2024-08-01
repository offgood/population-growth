import { useState } from "react";

const startStop = () => {
  const [play, setPlay] = useState<boolean>(false);
  return (
    <div onClick={}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="512"
        height="512"
        x="0"
        y="0"
        viewBox="0 0 512 512"
        // style={enable-background:new 0 0 512 512}
        // xml:space="preserve"
      >
        <g>
          <path
            d="M256 0C114.615 0 0 114.615 0 256s114.615 256 256 256 256-114.615 256-256S397.385 0 256 0zm-69.947 367.345v-222.69L378.908 256 186.053 367.345z"
            fill="#000000"
            opacity="1"
            data-original="#000000"
          ></path>
        </g>
      </svg>
    </div>
  );
};
