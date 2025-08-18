import { Hono, Context } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "@prasangjhawar/medium-common1";



export const blogRouter = new Hono<{
    Bindings: {
        DB: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string;
    }
}>()



blogRouter.use('/*', async(c, next) => {
    const authHeader = c.req.header("authorization") || "";

    try {
        
        const user = await verify(authHeader, c.env.JWT_SECRET) as {id: string};
    
        if(user){
            c.set("userId", user.id);
            await next();
        } else {
            c.status(403)
            return c.json({
                message: "You are not Authenticated!"
            })
        }
    } catch (error) {
        c.status(403)
        return c.json({
            message: "You are not Authenticated!"
        })
    }
})


blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
        if (!success){
            c.status(411)
            return c.json({
                message: "Incorrect inputs"
            })
        }
    const authorId = c.get("userId")
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DB
    }).$extends(withAccelerate());

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: authorId
        }
    })

    return c.json({
        id: blog.id
    })
})


blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
        if (!success){
            c.status(411)
            return c.json({
                message: "Incorrect inputs"
            })
        }
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DB
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    })

    return c.json({
        id: blog.id
    })


})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DB
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany();

    return c.json({
        posts
    })

})


blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DB
    }).$extends(withAccelerate());

    try {
        
        const blog = await prisma.post.findFirst({
            where: {
                id: id
            }
        })
    
        return c.json({
            blog
        })
    } catch (error) {
        c.status(411)
        return c.json({
            message: "Error while fetching the blog post"
        })
    }

})



