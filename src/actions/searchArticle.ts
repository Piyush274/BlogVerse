"use server"

import { redirect } from "next/navigation";

export const searchArticle = async (formData:FormData) => {

    const searchText = formData.get("search");

    if (typeof searchText !== "string" || !searchText) {
        redirect("/"); //for invalid search, redirect to home
    }

    redirect(`/articles?search=${searchText}`); //redirect to articles page with search query
}