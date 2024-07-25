import SideNav from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex gap-16 p-10 pt-12">
      <SideNav />

      {children}
    </div>
  );
}
