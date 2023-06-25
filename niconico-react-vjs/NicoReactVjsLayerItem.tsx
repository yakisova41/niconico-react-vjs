import React, { ReactNode } from "react";

export const NicoReactVjsLayerItem: React.FunctionComponent<{
  children?: ReactNode;
  enablePointerEvents?: boolean;
}> = ({ children, enablePointerEvents }) => {
  return (
    <div
      className={
        "niconico-react-vjs-layer-item" +
        (enablePointerEvents ? " niconico-react-vjs-layer-item-pointer" : "")
      }
    >
      {children}
    </div>
  );
};
