"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


//Zod checks the data before storing data to database to avoid uncertain data, empty, garbage data
//Prevents manually checking the data if (typeof title !== "string" || title.length < 3) 
const createArticleSchema = z.object(   
{
  title: z.string().min(3).max(100),
  category: z.string().min(3).max(50),
  content: z.string().min(10), 
});

//Intial state of the form
type CreateArticleFormState = {
  errors: {
    title?: string[];
    category?: string[];
    featuredImage?: string[];
    content?: string[];
    formErrors?: string[];
  };
};

//Function is async so return type is Promise
export const createArticle = async (prevState: CreateArticleFormState,formData: FormData): Promise<CreateArticleFormState> => 
{ 
  const result = createArticleSchema.safeParse({  //zod method that validates form data, does not throw error, returns object with success and error properties
    title: formData.get("title"), 
    category: formData.get("category"),
    content: formData.get("content"), 
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors, //flattens the zod error object to a simpler structure
    };
  }

  //Finding existing user in the database using clerkUserId
  const { userId } = await auth();

  if (!userId) {
    return {
      errors: {
        formErrors: ["You have to login first"],
      },
    };
  }

  
  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });


  if (!existingUser) {
    return {
      errors: {
        formErrors: ["User not found. Please register before creating an article."],
      },
    };
  }

  //Upload the image to Cloudinary

  const imageFile = formData.get("featuredImage") as File | null;
 
  if (!imageFile || imageFile?.name === "undefined") {
    return {
      errors: {
        featuredImage: ["Image file is required."],
      },
    };
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult: UploadApiResponse | undefined = await new Promise(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, 
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    }
  );

  const imageUrl = uploadResult?.secure_url;

  if (!imageUrl) {
    return {
      errors: {
        featuredImage: ["Failed to upload image. Please try again."],
      },
    };
  }


  //Create a new article in the database

  try {
    await prisma.articles.create({
      data: {
        title: result.data.title,
        category: result.data.category,
        content: result.data.content,
        featuredImage: imageUrl,
        authorId: existingUser.id, 
      },
    });
  } 
  catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          formErrors: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formErrors: ["Some internal server error occurred."],
        },
      };
    }
  }

  //Afrer creating the article, revalidate the path to update the cache, only refreshes the updated data rest cache
  revalidatePath("/dashboard");
  
  redirect("/dashboard");
};