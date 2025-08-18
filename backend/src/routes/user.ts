import { signinInput, signupInput } from "@prasangjhawar/medium-common1";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";



export const userRouter = new Hono<{
    Bindings: {
        DB: string,
        JWT_SECRET: string
    }
}>();


userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    if (!success){
        c.status(411)
        return c.json({
            message: "Incorrect inputs"
        })
    }
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DB	,
	}).$extends(withAccelerate());

	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password,
				name: body.name
			}
		});
		const token = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt: token });
	} catch(e) {
    console.error(e);
		c.status(403);
		return c.json({ error: "Invalid" });
	}
})


userRouter.post('/signin', async(c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DB
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const {success} = signinInput.safeParse(body);
    if (!success){
        c.status(411)
        return c.json({
            message: "Incorrect inputs"
        })
    }
	try {
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
				password: body.password
			}
		})
		if(!user){
			c.status(403);
			return c.json({error: "User doesn't exist!"});
		}

		const token = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.text(token);

	} catch (error) {
		c.status(411)
		return c.text("Invalid request!")
	}
})