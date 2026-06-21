"use client";

import { useRef, useState } from "react";
import { Button, Drawer } from "@khamudom/lumen-ui-react";
import type { Stadium } from "@/types";
import { FeaturedStadiumPicker } from "./FeaturedStadiumPicker";
import styles from "./AdminDrawer.module.css";

interface AdminDrawerPanelProps {
  stadiums: Stadium[];
  currentId?: string;
  resolvedName?: string;
}

export function AdminDrawerPanel({
  stadiums,
  currentId,
  resolvedName,
}: AdminDrawerPanelProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="secondary"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Admin
      </Button>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        right
        heading="Admin controls"
        description="Development-only editorial settings."
        returnFocusRef={triggerRef}
      >
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Featured venue</h3>
          <p className={styles.sectionHint}>
            Choose which stadium appears as featured on the Stadiums and
            Insights pages.
          </p>
          <FeaturedStadiumPicker
            stadiums={stadiums}
            currentId={currentId}
            resolvedName={resolvedName}
          />
        </section>
      </Drawer>
    </>
  );
}
