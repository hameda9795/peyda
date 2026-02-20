import { getCurrentUser } from "@/app/actions";
import { redirect } from "next/navigation";
import ClientLayout from "./ClientLayout";
import { Hourglass } from "lucide-react";

export default async function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
    const currentUser = await getCurrentUser();

    // If no user or no business, they should not be here
    if (!currentUser || !currentUser.businessId) {
        redirect('/bedrijf-aanmelden?message=no-business');
    }

    const isApproved = currentUser.business?.status === 'approved';
    const isPublished = currentUser.business?.publishStatus === 'PUBLISHED';

    // If published but pending approval, show waiting screen
    if (isPublished && !isApproved) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg shadow-amber-100 max-w-md w-full p-8 text-center space-y-6 border border-amber-100">
                    <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-amber-200">
                        <Hourglass className="h-10 w-10 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Beoordeling in uitvoering</h1>
                        <p className="text-slate-600">
                            Bedankt voor het publiceren van je bedrijf! Ons team is momenteel bezig met het beoordelen van je gegevens. Zodra je account is goedgekeurd, krijg je toegang tot je profiel.
                        </p>
                    </div>
                    <form action="/api/auth/logout" method="POST">
                        <button type="submit" className="w-full px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                            Uitloggen
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // If approved or not yet published (DRAFT), show the normal client layout
    return <ClientLayout>{children}</ClientLayout>;
}
