import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/signin', async (req: Request, res: Response) => {
  res.send('Hello Juno - signin');
});

export { router as signinRouter };
