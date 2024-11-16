import { StartClient } from "@tanstack/start";
import { default as nProgress } from "nprogress";
// app/client.tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

const router = createRouter();

nProgress.configure({ showSpinner: false });

router.subscribe(
	"onBeforeLoad",
	({ pathChanged }) => pathChanged && nProgress.start(),
);
router.subscribe("onLoad", () => nProgress.done());

hydrateRoot(document, <StartClient router={router} />);
