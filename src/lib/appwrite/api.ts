import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, client, databases, storage } from "./config";
import { Avatars, ID, Query } from "appwrite";
import exp from "constants";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,//Comming from form 
            imageUrl: avatarUrl,
        })

        return newUser;
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function saveUserToDB(user: {
    accountId: String;
    name: String;
    email: String;
    username: String;
    imageUrl: URL;

}) {

    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionID,
            ID.unique(),
            user
        );

        return newUser;
    } catch (error) {
        console.log(error);
    }

}

export async function signInAccount(user: { email: string, password: string }) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password)
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionID,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current")
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function createPost(post: INewPost) {
    try {
        // Upload file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;

        // Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert tags into array bcz it is string with comma's
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // Create post
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionID,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                image: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageID,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageID,
            fileId,
            2000,
            2000,
        );

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageID, fileId);

        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionID,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionID,
            postId,
            {
                likes: likesArray,
            }
        );

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function savePost(userId: string, postId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionID,
            ID.unique(),
            {
                user: userId,
                post: postId,
            }
        );

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionID,
            savedRecordId
        );

        if (!statusCode) throw Error;

        return { status: "Ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function getPostById(postId?: string) {
    if (!postId) throw Error;

    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionID,
            postId
        );

        if (!post) throw Error;

        return post;
    } catch (error) {
        console.log(error);
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
  
    try {
      let image = {
        image: post.imageUrl,
        imageId: post.imageId,
      };
  
      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;
  
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, image: fileUrl, imageId: uploadedFile.$id };
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      //  Update post
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionID,
        post.postId,
        {
          caption: post.caption,
          image: image.image,
          imageId: image.imageId,
          location: post.location,
          tags: tags,
        }
      );
  
      // Failed to update
      if (!updatedPost) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageId);
        }
  
        // If no new file uploaded, just throw error
        throw Error;
      }
  
      // Safely delete old file after successful update
      if (hasFileToUpdate) {
        await deleteFile(post.imageId);
      }
  
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }

  export async function deletePost(postId?: string, imageId?: string) {
    if (!postId || !imageId) return;
  
    try {
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionID,
        postId
      );
  
      if (!statusCode) throw Error;
  
      await deleteFile(imageId);
  
      return { status: "Ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function getUserPosts(userId?: string) {
    if (!userId) return;
  
    try {
      const post = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionID,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      );
  
      if (!post) throw Error;
  
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];
  
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }
  
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionID,
        queries
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function searchPosts(searchTerm: string) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionID,
        [Query.search("caption", searchTerm)]
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
  
export async function getUsers(limit?: number) {
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionID,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
  
      if (!users) throw Error;
  
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  export async function getSavedPosts(userId: string) {
    try {
        const savedPosts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionID,
            [Query.equal("user", userId)]
        );

        if (!savedPosts) throw Error;

        return savedPosts;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById(userId: string) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionID,
        userId
      );
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Re-throw the error to be handled by the query function
    }
  }
  // ============================== UPDATE USER
  export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
      let image = {
        imageUrl: user.imageUrl,
        imageId: user.imageId,
      };
  
      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(user.file[0]);
        if (!uploadedFile) throw Error;
  
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }
  
      //  Update user
      const updatedUser = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionID,
        user.userId,
        {
          name: user.name,
          bio: user.bio,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
        }
      );
  
      // Failed to update
      if (!updatedUser) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageId);
        }
        // If no new file uploaded, just throw error
        throw Error;
      }
  
      // Safely delete old file after successful update
      if (user.imageId && hasFileToUpdate) {
        await deleteFile(user.imageId);
      }
  
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }