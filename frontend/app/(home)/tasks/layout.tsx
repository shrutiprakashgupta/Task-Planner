export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
        <main className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col">
            <main className="grid flex-1 items-start bg-muted/40">
              {children}
            </main>
          </div>
        </main>
  );
}