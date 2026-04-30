import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    form.reset();
    setProduct("");
  };

  return (
    <>
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get in touch for quotes, product inquiries, or to discuss your mineral supply needs.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">Get In Touch</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Whether you need a bulk supply quote or have questions about our products, our team is here to help.
              </p>
              {[
                { icon: MapPin, title: "Visit Us", text: "123 Industrial Avenue\nMining District, MD 12345" },
                { icon: Phone, title: "Call Us", text: "+1 (234) 567-890\n+1 (234) 567-891" },
                { icon: Mail, title: "Email Us", text: "info@geocoreminerals.com\nsales@geocoreminerals.com" },
                { icon: Clock, title: "Business Hours", text: "Mon - Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 1:00 PM" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="p-6 md:p-8 rounded-lg bg-card border border-border">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Request a Quote</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" required placeholder="John Smith" maxLength={100} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" placeholder="Your Company" maxLength={100} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" required placeholder="john@company.com" maxLength={255} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+1 (234) 567-890" maxLength={20} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">Product Interest</Label>
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
                      <Label htmlFor="quantity">Estimated Quantity</Label>
                      <Input id="quantity" name="quantity" placeholder="e.g., 50 tons/month" maxLength={50} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" name="message" required placeholder="Tell us about your requirements..." rows={5} maxLength={2000} />
                  </div>
                  <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
                    {loading ? "Sending..." : "Send Message"} <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-80 bg-muted">
        <iframe
          title="GeoCore Minerals Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.6!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
};

export default Contact;
