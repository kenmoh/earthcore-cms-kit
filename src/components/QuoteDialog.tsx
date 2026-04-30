import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuoteDialogProps {
  children: React.ReactNode;
}

const QuoteDialog = ({ children }: QuoteDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") || "").trim(),
      company: String(data.get("company") || "").trim() || null,
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim() || null,
      product: product || null,
      quantity: String(data.get("quantity") || "").trim() || null,
      message: String(data.get("message") || "").trim(),
    };

    const { error } = await supabase.from("quote_requests").insert(payload);
    setLoading(false);

    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Quote Request Sent!", description: "We'll get back to you within 24 hours." });
    form.reset();
    setProduct("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Request a Quote</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="q-name">Full Name *</Label>
              <Input id="q-name" name="name" required placeholder="John Smith" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-company">Company</Label>
              <Input id="q-company" name="company" placeholder="Your Company" maxLength={100} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="q-email">Email *</Label>
              <Input id="q-email" name="email" type="email" required placeholder="john@company.com" maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-phone">Phone</Label>
              <Input id="q-phone" name="phone" type="tel" placeholder="+1 (234) 567-890" maxLength={20} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="q-product">Product Interest</Label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limestone">Limestone</SelectItem>
                  <SelectItem value="dolomite">Dolomite</SelectItem>
                  <SelectItem value="lepidolite">Lepidolite</SelectItem>
                  <SelectItem value="custom">Custom Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-quantity">Estimated Quantity</Label>
              <Input id="q-quantity" name="quantity" placeholder="e.g., 50 tons/month" maxLength={50} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-message">Message *</Label>
            <Textarea id="q-message" name="message" required placeholder="Tell us about your requirements..." rows={4} maxLength={2000} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Submit Quote Request"} <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
