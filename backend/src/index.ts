import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'


const app = new Hono<{
	Bindings: {
		DB: string,
		JWT_SECRET: string,
	}
}>();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DB	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
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


app.post('/api/v1/signin', async(c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DB
	}).$extends(withAccelerate());

	const body = await c.req.json();
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

export default app
