import { Navigate, useNavigate, useParams } from "react-router-dom";
import PostForm from "@/components/forms/PostForm";
import { useGetPostById, useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Loader_Circle } from "@/components/shared/Loader";

const EditPost = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUser();
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id || '');
  if(currentUser?.$id != post?.creator.$id) {
    navigate('/')
  }


  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader_Circle />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isLoading ? <Loader_Circle /> : <PostForm action="Update" post={post} />}
      </div>
    </div>
  );
};

export default EditPost;