import type { ComponentProps } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/store/usePlayerStore";

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

interface AddPlaylistFormProps {
  onOpenChange?(open: boolean): void;
}

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    url: z.string().url("Url must be a valid link."),
  })
  .required({ name: true, url: true });

function AddPlaylistForm({
  className,
  onOpenChange,
}: ComponentProps<"form"> & AddPlaylistFormProps) {
  const addPlaylist = usePlayerStore((store) => store.addPlaylist);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", url: "https://" },
    shouldUseNativeValidation: false,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const promise = addPlaylist(values.name, values.url);

    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        form.reset();

        if (onOpenChange) onOpenChange(false);

        return "Loaded succesfuly!";
      },
      error: "Loading error!!!",
    });
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
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
}

export default AddPlaylistForm;
