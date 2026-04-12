import { Trash2, GripVertical } from "lucide-react";
import { useFetcher } from "react-router";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

interface SortablePokemonProps {
  pokemon: any;
  index: number;
  isDragged: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

export function SortablePokemon({
  pokemon,
  index,
  isDragged,
  onDragStart,
  onDragOver,
  onDragEnd,
}: SortablePokemonProps) {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);

  const handleRelease = () => {
    fetcher.submit({ intent: "release", id: pokemon.id }, { method: "post" });
    setOpen(false); // Closes the main Dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* The Draggable Trigger Area */}
      <DialogTrigger asChild>
        <div
          draggable
          onDragStart={() => onDragStart(index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
          className={`
            group relative flex items-center justify-center aspect-square rounded-full
            transition-all duration-300 cursor-pointer active:cursor-grabbing
            hover:bg-slate-100/50
            ${isDragged ? "opacity-10 scale-90" : "opacity-100"}
          `}
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-slate-300" />
          </div>

          <img
            src={`/images/sprites/${pokemon.pokemon_id}.avif`}
            className="w-24 h-24 object-contain pointer-events-none select-none transition-transform group-hover:scale-110"
            alt={pokemon.name}
          />
        </div>
      </DialogTrigger>

      {/* The Options Modal */}
      <DialogContent className="sm:max-w-[360px] p-0 overflow-hidden border-none shadow-2xl">
        <div
          className="h-32 w-full flex items-center justify-center relative"
          style={{ backgroundColor: `${pokemon.color}33` }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at center, ${pokemon.color} 0%, transparent 70%)`,
            }}
          />
          <img
            src={`/images/sprites/${pokemon.pokemon_id}.avif`}
            className="w-28 h-28 object-contain drop-shadow-xl z-10"
            alt={pokemon.name}
          />
        </div>

        <div className="p-6">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">
              {pokemon.name}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium italic pt-2">
              "A valuable addition to your math collection. This Pokémon was
              caught after a successful problem solve."
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 mt-8">
            {/* New Styled Confirmation Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full h-12 font-bold flex gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Release
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] md:max-w-[400px] lg:max-w-[450px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will release <strong>{pokemon.name}</strong> back into
                    the wild. You won't be able to undo this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRelease}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Yes, Release
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="secondary"
              className="w-full h-12 font-bold"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
