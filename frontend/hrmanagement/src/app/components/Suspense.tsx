import { ReactNode, Suspense } from "react";

export default function Page({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div>Sayfa yükleniyor...</div>}>
        {children}
      </Suspense>
    </>
  );
}