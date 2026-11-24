import { redirect } from "next/navigation";
import { Brand } from "@/components/dashboard/brand";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { SampleDataBadge } from "@/components/dashboard/sample-data-badge";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-60 shrink-0 flex-col gap-6 border-r bg-background p-4 md:flex">
        <Brand />
        <SidebarNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <MobileNav />
          <div className="md:hidden">
            <Brand />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <SampleDataBadge />
            <UserMenu user={session.user} />
          </div>
        </header>
        <main className="flex-1 space-y-6 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
