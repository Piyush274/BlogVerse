import EditArticlePage from '@/components/articles/EditArticlePage'
import { prisma } from '@/lib/prisma'
 
import React from 'react'

type PropsType = {
    params:Promise<{id:string}>
}
const page = async ({params}:PropsType) => { 
    const id = (await params).id
    const article = await prisma.articles.findUnique({
        where:{
          id
        }
      });
      if(!article){
        return <h1>Article not found.</h1>
      }
  return (
    <div> 
        <EditArticlePage article={article}/>
    </div>
  )
}

export default page