"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ConfirmModal from "../../_components/ConfirmModal";

const SETTING_FIELDS = [
  { key: "shop_name", label: "Shop Name", type: "text" },
  { key: "company_name", label: "Company Name", type: "text" },
  { key: "email", label: "Contact Email", type: "email" },
  { key: "contact", label: "Contact Phone", type: "text" },
  { key: "website", label: "Website URL", type: "url" },
  { key: "address", label: "Address", type: "text" },
  { key: "default_currency", label: "Default Currency", type: "text" },
  { key: "timezone", label: "Timezone", type: "text" },
  { key: "date_format", label: "Date Format", type: "text" },
  { key: "vat_number", label: "VAT Number", type: "text" },
  { key: "post_code", label: "Post Code", type: "text" },
  { key: "percentage", label: "Pay Later Percentage (%)", type: "number" },
  { key: "number_of_image_per_product", label: "Max Images Per Product", type: "number" },
  { key: "receipt_size", label: "Receipt Size", type: "text", hint: "e.g. A4, Letter" },
];

export default function SettingsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [seedConfirm, setSeedConfirm] = useState(false);
  const [truncateProductsConfirm, setTruncateProductsConfirm] = useState(false);
  const [truncateCategoriesConfirm, setTruncateCategoriesConfirm] = useState(false);
  const [dbMessage, setDbMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => fetch("/api/admin/settings").then((r) => r.json()),
  });

  useEffect(() => {
    if (data?.settings) {
      setForm(data.settings);
    }
  }, [data]);

  const seedMutation = useMutation({
    mutationFn: () =>
      fetch("/api/admin/seed", { method: "POST" }).then((r) => r.json()),
    onSuccess: (data: any) => {
      setSeedConfirm(false);
      setDbMessage({ text: data.message ?? "Seeded successfully", ok: !data.error });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      setTimeout(() => setDbMessage(null), 4000);
    },
  });

  const truncateProductsMutation = useMutation({
    mutationFn: () =>
      fetch("/api/admin/products", { method: "DELETE" }).then((r) => r.json()),
    onSuccess: (data: any) => {
      setTruncateProductsConfirm(false);
      setDbMessage({ text: data.message ?? "Products truncated", ok: true });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setTimeout(() => setDbMessage(null), 4000);
    },
  });

  const truncateCategoriesMutation = useMutation({
    mutationFn: () =>
      fetch("/api/admin/categories", { method: "DELETE" }).then((r) => r.json()),
    onSuccess: (data: any) => {
      setTruncateCategoriesConfirm(false);
      setDbMessage({ text: data.message ?? "Categories truncated", ok: true });
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      setTimeout(() => setDbMessage(null), 4000);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (body: Record<string, string>) =>
      fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  if (isLoading) {
    return <div className="text-gray-400 text-sm py-10 text-center">Loading settings...</div>;
  }

  const dbIsPending = seedMutation.isPending || truncateProductsMutation.isPending || truncateCategoriesMutation.isPending;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Database Management</h3>
        <p className="text-xs text-gray-500">
          Use these tools to seed demo data or clear the database. Truncate actions are irreversible.
        </p>

        {dbMessage && (
          <p className={`text-sm ${dbMessage.ok ? "text-green-600" : "text-red-500"}`}>
            {dbMessage.text}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSeedConfirm(true)}
            className="px-4 py-2 bg-[#004B93] text-white rounded-lg text-sm font-semibold hover:bg-[#003a73]"
          >
            Seed Database
          </button>
          <button
            onClick={() => setTruncateProductsConfirm(true)}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-semibold hover:bg-red-100"
          >
            Truncate Products
          </button>
          <button
            onClick={() => setTruncateCategoriesConfirm(true)}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-semibold hover:bg-red-100"
          >
            Truncate Categories
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h3 className="font-semibold text-gray-800">Global Settings</h3>

        {SETTING_FIELDS.map(({ key, label, type, hint }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              value={form[key] ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004B93]/30"
              placeholder={hint}
            />
          </div>
        ))}

        {saved && <p className="text-sm text-green-600">Settings saved successfully!</p>}
        {saveMutation.isError && <p className="text-sm text-red-500">Failed to save. Please try again.</p>}

        <button
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending}
          className="w-full py-2.5 bg-[#3DBD7F] hover:bg-[#2ea86f] text-white font-semibold rounded-lg text-sm disabled:opacity-60"
        >
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
      <ConfirmModal
        isOpen={seedConfirm}
        title="Seed Database"
        message="This will insert demo categories and products (uses ON CONFLICT DO NOTHING, so existing records are skipped). Proceed?"
        confirmLabel="Seed"
        loading={seedMutation.isPending}
        onConfirm={() => seedMutation.mutate()}
        onCancel={() => setSeedConfirm(false)}
      />

      <ConfirmModal
        isOpen={truncateProductsConfirm}
        title="Truncate All Products"
        message="This will permanently delete ALL products, images, and attributes. This action cannot be undone."
        confirmLabel="Truncate Products"
        loading={truncateProductsMutation.isPending}
        onConfirm={() => truncateProductsMutation.mutate()}
        onCancel={() => setTruncateProductsConfirm(false)}
      />

      <ConfirmModal
        isOpen={truncateCategoriesConfirm}
        title="Truncate All Categories"
        message="This will permanently delete ALL categories and remove all product-category links. This action cannot be undone."
        confirmLabel="Truncate Categories"
        loading={truncateCategoriesMutation.isPending}
        onConfirm={() => truncateCategoriesMutation.mutate()}
        onCancel={() => setTruncateCategoriesConfirm(false)}
      />
    </div>
  );
}
