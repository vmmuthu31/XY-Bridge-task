import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
  return (
    <div className="flex items-center justify-between w-full p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <img
          src="https://docs.xy.finance/~gitbook/image?url=https%3A%2F%2F3694085950-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-Mcs9EhDrgbKHodtcAT6%252Ficon%252FeeZo8dLM2CuU1OvfXfkw%252FSymbol.png%3Falt%3Dmedia%26token%3D4122cb6e-135a-49ff-97f4-d5e706b7c7b8&width=32&dpr=2&quality=100&sign=fd29b661&sv=1"
          alt="logo"
          className="w-8 h-8"
        />
        <h1 className="text-lg font-bold">Bridge Application</h1>
      </div>
      <div className="flex items-center space-x-4">
        <ConnectButton />
      </div>
    </div>
  );
}

export default Navbar;
