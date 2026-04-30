import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, LayoutDashboard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import CmsSection from "@/components/admin/CmsSection";
import QuoteRequestsAdmin from "@/components/admin/QuoteRequestsAdmin";

const sectionConfigs = [
  {
    table: "cms_hero" as const,
    title: "Hero Section",
    fields: [
      { name: "headline", label: "Headline", type: "text" as const, required: true },
      { name: "subtitle", label: "Subtitle", type: "textarea" as const },
      { name: "cta_text", label: "CTA Button Text", type: "text" as const },
      { name: "cta_link", label: "CTA Link", type: "text" as const },
      { name: "image_url", label: "Image URL", type: "text" as const },
    ],
  },
  {
    table: "cms_stats" as const,
    title: "Stats",
    sortable: true,
    fields: [
      { name: "value", label: "Value", type: "text" as const, required: true },
      { name: "label", label: "Label", type: "text" as const, required: true },
      { name: "sort_order", label: "Sort Order", type: "number" as const },
    ],
  },
  {
    table: "cms_products" as const,
    title: "Products",
    sortable: true,
    fields: [
      { name: "name", label: "Name", type: "text" as const, required: true },
      { name: "description", label: "Description", type: "textarea" as const },
      { name: "image_url", label: "Image URL", type: "text" as const },
      { name: "slug", label: "Slug", type: "text" as const },
      { name: "sort_order", label: "Sort Order", type: "number" as const },
    ],
  },
  {
    table: "cms_testimonials" as const,
    title: "Testimonials",
    sortable: true,
    fields: [
      { name: "author_name", label: "Author Name", type: "text" as const, required: true },
      { name: "author_role", label: "Author Role", type: "text" as const },
      { name: "text", label: "Testimonial Text", type: "textarea" as const, required: true },
      { name: "rating", label: "Rating (1-5)", type: "number" as const },
      { name: "sort_order", label: "Sort Order", type: "number" as const },
    ],
  },
  {
    table: "cms_faqs" as const,
    title: "FAQs",
    sortable: true,
    fields: [
      { name: "question", label: "Question", type: "text" as const, required: true },
      { name: "answer", label: "Answer", type: "textarea" as const, required: true },
      { name: "sort_order", label: "Sort Order", type: "number" as const },
    ],
  },
  {
    table: "cms_cta" as const,
    title: "CTA Section",
    fields: [
      { name: "headline", label: "Headline", type: "text" as const, required: true },
      { name: "description", label: "Description", type: "textarea" as const },
      { name: "button_text", label: "Button Text", type: "text" as const },
      { name: "button_link", label: "Button Link", type: "text" as const },
    ],
  },
];

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="font-heading text-lg font-bold text-foreground">CMS Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <Tabs defaultValue="quote_requests" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="quote_requests" className="text-xs">
              Quote Requests
            </TabsTrigger>
            {sectionConfigs.map((s) => (
              <TabsTrigger key={s.table} value={s.table} className="text-xs">
                {s.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="quote_requests">
            <QuoteRequestsAdmin />
          </TabsContent>
          {sectionConfigs.map((s) => (
            <TabsContent key={s.table} value={s.table}>
              <CmsSection config={s} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
