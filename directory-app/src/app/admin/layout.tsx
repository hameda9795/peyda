import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-row" style={{ backgroundColor: '#f3f4f6' }} suppressHydrationWarning>
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-6 md:p-8" style={{ backgroundColor: '#f3f4f6' }}>
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
