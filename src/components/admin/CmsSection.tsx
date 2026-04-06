import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CrudConfig {
  table: string;
  title: string;
  fields: { name: string; label: string; type: "text" | "textarea" | "number"; required?: boolean }[];
  sortable?: boolean;
}

interface CmsRecord {
  id: string;
  [key: string]: unknown;
}

const CmsSection = ({ config }: { config: CrudConfig }) => {
  const [records, setRecords] = useState<CmsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<CmsRecord | null>(null);
  const { toast } = useToast();

  const fetchRecords = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from as any)(config.table).select("*");
    if (config.sortable) {
      query = query.order("sort_order", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }
    const { data, error } = await query;
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setRecords((data as CmsRecord[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Record<string, unknown> = {};
    config.fields.forEach((f) => {
      const val = formData.get(f.name);
      values[f.name] = f.type === "number" ? Number(val) : val;
    });

    if (editRecord?.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from as any)(config.table).update(values).eq("id", editRecord.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    } else {
      if (config.sortable) {
        values.sort_order = records.length;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from as any)(config.table).insert(values);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    toast({ title: "Saved!" });
    setEditOpen(false);
    setEditRecord(null);
    fetchRecords();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from as any)(config.table).delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted!" });
      fetchRecords();
    }
  };

  const openCreate = () => {
    setEditRecord(null);
    setEditOpen(true);
  };

  const openEdit = (record: CmsRecord) => {
    setEditRecord(record);
    setEditOpen(true);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-foreground">{config.title}</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {records.length === 0 ? (
        <p className="text-sm text-muted-foreground">No records yet. Click "Add" to create one.</p>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <div key={record.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              {config.sortable && <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {String(record[config.fields[0].name] || "Untitled")}
                </p>
                {config.fields[1] && (
                  <p className="text-xs text-muted-foreground truncate">
                    {String(record[config.fields[1].name] || "")}
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(record)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editRecord ? "Edit" : "Add"} {config.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`field-${field.name}`}>{field.label} {field.required && "*"}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={`field-${field.name}`}
                    name={field.name}
                    required={field.required}
                    defaultValue={editRecord ? String(editRecord[field.name] || "") : ""}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={`field-${field.name}`}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    defaultValue={editRecord ? String(editRecord[field.name] || "") : ""}
                  />
                )}
              </div>
            ))}
            <Button type="submit" className="w-full">
              {editRecord ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CmsSection;
