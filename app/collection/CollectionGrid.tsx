"use client";

import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderCaught, releasePokemon } from "./actions";
import type { CaughtItem } from "./types";
import styles from "./collection.module.css";

export default function CollectionGrid({
  initialItems,
}: {
  initialItems: CaughtItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<CaughtItem | null>(null);

  // dnd-kit generates accessibility IDs that differ between server and client.
  // Render the plain grid first, then enable dragging after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);

    setItems(next);
    reorderCaught(next.map((item) => item.id)).catch((err) => {
      console.error("Failed to save order", err);
    });
  }

  if (items.length === 0) {
    return <p className={styles.empty}>No Pokémon yet. Go catch some!</p>;
  }

  return (
    <>
      {mounted ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className={styles.grid}>
              {items.map((item) => (
                <SortableCard key={item.id} item={item} onOpen={setSelected} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <StaticCard key={item.id} item={item} onOpen={setSelected} />
          ))}
        </div>
      )}

      <PokemonDialog item={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function StaticCard({
  item,
  onOpen,
}: {
  item: CaughtItem;
  onOpen: (item: CaughtItem) => void;
}) {
  return (
    <button type="button" className={styles.card} onClick={() => onOpen(item)}>
      <img
        src={item.sprite}
        alt=""
        width={96}
        height={96}
        draggable={false}
        className={styles.sprite}
      />
    </button>
  );
}

function SortableCard({
  item,
  onOpen,
}: {
  item: CaughtItem;
  onOpen: (item: CaughtItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const className = [styles.card, isDragging && styles.dragging]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={className}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(item)}
    >
      <img
        src={item.sprite}
        alt=""
        width={96}
        height={96}
        draggable={false}
        className={styles.sprite}
      />
    </button>
  );
}

function PokemonDialog({
  item,
  onClose,
}: {
  item: CaughtItem | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = item !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="pokemon-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {item && (
        <div className={styles.dialogBody}>
          <img
            src={item.sprite}
            alt=""
            width={160}
            height={160}
            className={styles.dialogSprite}
          />

          <form
            action={releasePokemon}
            onSubmit={onClose}
            className={styles.dialogActions}
          >
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" className={styles.release}>
              Release
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => ref.current?.close()}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </dialog>
  );
}
