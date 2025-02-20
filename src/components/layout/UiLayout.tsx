import Header from "./Header";

export function UILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-[family-name:var(--font-geist-mono)]">
      <Header />
      <main>{children}</main>
    </div>
  );
}
