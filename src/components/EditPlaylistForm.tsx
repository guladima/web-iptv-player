import type { ComponentProps } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { type Playlist, usePlayerStore } from "@/store/usePlayerStore";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EditPlaylistFormProps {
  playlist: Partial<Playlist>;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    url: z.string().url("Url must be a valid link."),
  })
  .required({ name: true, url: true });

function EditPlaylistForm({
  className,
  playlist,
  onOpenChange,
}: ComponentProps<"form"> & EditPlaylistFormProps) {
  const editPlaylist = usePlayerStore((store) => store.editPlaylist);
  const deletePlaylist = usePlayerStore((store) => store.deletePlaylist);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: playlist.name ?? "", url: playlist.url ?? "" },
    shouldUseNativeValidation: false,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    if (!playlist.id) throw new Error("Please provide playlist id");

    const edited = editPlaylist(playlist.id, values.name, values.url);

    if (edited) {
      toast.success("Playlist saved!");
      onOpenChange(false);
    }
  }

  function onDelete() {
    if (!playlist.id) throw new Error("Please provide playlist id");

    const deleted = deletePlaylist(playlist.id);

    if (deleted) {
      toast.success("Playlist deleted!");
      onOpenChange(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn("grid items-start gap-4", className)}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter playlist name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="grid gap-2 space-y-0">
              <FormLabel htmlFor="url">URL</FormLabel>
              <FormControl>
                <Input
                  id="url"
                  type="url"
                  placeholder="Enter playlist URL"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}

export default EditPlaylistForm;
