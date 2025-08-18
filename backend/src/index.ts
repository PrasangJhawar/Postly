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
				password: body.password
			}
		});
		const token = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt: token });
	} catch(e) {
    console.error(e);
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
})


app.post('/api/v1/signin', async(c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DB
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if(!user){
		c.status(403);
		return (c.json({error: "User not found!"}));
	}

	const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
	return c.json({jwt});
})

export default app
