import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { postValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useNavigate } from "react-router-dom"
import { useToast } from "../ui/use-toast"
import { useUserContext } from "@/context/AuthContext"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { Loader} from "../shared/Loader"

type PostFormProps = {
  post?: Models.Document;
  action: 'Create' | "Update";
}

const PostForm = ({ post, action }: PostFormProps) => {
  const {mutateAsync: createPost, isPending: isLoadingCreate} = useCreatePost();
  const {mutateAsync: updatePost, isPending: isLoadingUpdate} = useUpdatePost();
  const { toast } = useToast();
  const {user} = useUserContext();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof postValidation>) {
    // ACTION = UPDATE
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.image,
      });

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost({
      ...values,
      userId: user.id,
    })

    if(!newPost){
      toast({
        title: "Please try again :("
      }) 
      
    }

    navigate('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_lable">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar"{...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_lable">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.image}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_lable">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_lable">Add Tags (separated by comma " , ")</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Paris, Learning, Vacation"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_red" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isLoadingUpdate}>
          {(isLoadingCreate || isLoadingUpdate) && <Loader/>}{action} Post</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm