"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { DeleteNoteButton } from "./delete-note-button";
import { ArrowLeft, Save, Edit, X } from "lucide-react";
import { btnIconStyles } from "@/styles/styles";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function NotesPage({
  params,
}: {
  params: { noteId: Id<"notes"> };
}) {
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();
  const note = useQuery(api.notes.getNote, { noteId });
  const updateNote = useMutation(api.notes.updateNote);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // Sync the title and text state with the fetched note data
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setText(note.text);
    }
  }, [note]);

  // Function to check if changes have been made
  const hasChanges = () => {
    return title !== note?.title || text !== note?.text;
  };

  const handleSave = async () => {
    if (noteId) {
      await updateNote({ noteId, title, text });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(note?.title || "");
    setText(note?.text || "");
    setIsEditing(false);
  };

  return (
    <main className="h-full w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className={btnIconStyles} />
          </Button>

          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-zinc-400 bg-transparent p-1 text-4xl font-bold dark:border-zinc-600"
              placeholder="Enter title"
            />
          ) : (
            <h1 className="text-4xl font-bold">{title}</h1>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                variant="outline"
                className="flex gap-2"
                disabled={!hasChanges()} // Disable if no changes
              >
                <Save className={btnIconStyles} />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button
                onClick={handleCancel}
                variant="secondary"
                className="flex gap-2"
              >
                <X className={btnIconStyles} />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex gap-2"
              >
                <Edit className={btnIconStyles} />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <DeleteNoteButton noteId={note?._id!} />
            </>
          )}
        </div>
      </div>
      <div className="relative h-[780px] w-full overflow-y-scroll rounded bg-zinc-100 p-4 dark:bg-zinc-900">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-full w-full resize-none whitespace-pre-line border border-zinc-400 bg-transparent p-2 dark:border-zinc-600"
            placeholder="Enter note text"
          />
        ) : (
          <div className="whitespace-pre-line pr-8">{text}</div>
        )}
      </div>
    </main>
  );
}

// "use client";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useParams, useRouter } from "next/navigation";
// import { Id } from "@/convex/_generated/dataModel";
// import { DeleteNoteButton } from "./delete-note-button";
// import { ArrowLeft } from "lucide-react";
// import { btnIconStyles } from "@/styles/styles";
// import { Button } from "@/components/ui/button";

// export default function NotesPage({
//   params,
// }: {
//   params: { noteId: Id<"notes"> };
// }) {
//   const { noteId } = useParams<{ noteId: Id<"notes"> }>();
//   const note = useQuery(api.notes.getNote, {
//     noteId,
//   });
//   const router = useRouter();

//   return (
//     <main className="h-full w-full space-y-8">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center justify-between gap-4">
//           <Button
//             onClick={() => router.back()}
//             variant="outline"
//             size="icon"
//             className="rounded-full"
//           >
//             <ArrowLeft className={btnIconStyles} />
//           </Button>

//           <h1 className="text-4xl font-bold">{note?.title}</h1>
//         </div>
//         <DeleteNoteButton noteId={note?._id!} />
//       </div>
//       <div className="relative h-[780px] w-full overflow-y-scroll rounded bg-zinc-100 p-4 dark:bg-zinc-900">
//         <div className="whitespace-pre-line pr-8">{note?.text}</div>
//       </div>
//     </main>
//   );
// }
