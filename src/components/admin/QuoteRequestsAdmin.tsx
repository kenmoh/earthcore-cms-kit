import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, Phone, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuoteRequest {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  product: string | null;
  quantity: string | null;
  message: string;
  status: string;
  created_at: string;
}

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

const QuoteRequestsAdmin = () => {
  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote request?")) return;
    const { error } = await supabase.from("quote_requests").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  if (loading) return <div className="text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-foreground">
        Quote Requests ({items.length})
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No quote requests yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-card border border-border rounded-lg space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.status}</Badge>
                  <Select value={item.status} onValueChange={(v) => updateStatus(item.id, v)}>
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <a href={`mailto:${item.email}`} className="hover:text-primary truncate">
                    {item.email}
                  </a>
                </div>
                {item.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{item.phone}</span>
                  </div>
                )}
                {item.company && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{item.company}</span>
                  </div>
                )}
                {(item.product || item.quantity) && (
                  <div className="text-muted-foreground">
                    {item.product && <span className="capitalize">{item.product}</span>}
                    {item.product && item.quantity && " · "}
                    {item.quantity}
                  </div>
                )}
              </div>

              <p className="text-sm text-foreground whitespace-pre-line bg-muted/50 p-3 rounded">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuoteRequestsAdmin;
