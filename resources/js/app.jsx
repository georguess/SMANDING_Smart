import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import AdminLayout from "./Layouts/AdminLayout";

const appName = import.meta.env.VITE_APP_NAME || "SMANDING";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        );

        if (name.startsWith("Admin/")) {
            page.default.layout ??= (pageElement) => (
                <AdminLayout
                    title={pageElement.type.title || "SMANDING"}
                    subtitle={
                        pageElement.type.subtitle ||
                        "Smart Attendance System"
                    }
                >
                    {pageElement}
                </AdminLayout>
            );
        }

        return page;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: "#0EA5E9",
    },
});