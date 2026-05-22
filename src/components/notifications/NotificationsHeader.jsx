import { Plus, CheckCheck, Trash2, Settings } from "lucide-react";

export default function NotificationsHeader() {
  return (
    <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">

      <div>
        <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
          Notifications
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track alerts, reminders, and operational updates across your fleet.
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        
    
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-950"
        >
          <Plus className="h-4 w-4" />
          Create Notification
        </button>
        <div className="flex flex-wrap items-center gap-3">
          

          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:opacity-80"
          >
            <CheckCheck className="h-4 w-4" />

            <span className="underline underline-offset-2">
              Mark All as Read
            </span>
          </button>

    
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}