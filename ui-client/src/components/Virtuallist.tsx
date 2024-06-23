import { ReactNode } from "react";
import { FixedSizeList } from "react-window";

type VirtualType = {
  itemCount: number;
  height?: number;
  width?: number;
  children: ReactNode;
};

export default function VirtualList({
  itemCount,
  children,
  height,
  width,
}: VirtualType) {
  return (
    <FixedSizeList
      height={height}
      width={width}
      itemCount={itemCount}
      itemSize={40} // Height of each row
    >
      {children}
    </FixedSizeList>
  );
}
