import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const PASSWORD_HASH = process.env.PASSWORD || 'SUPER_SECRET_PASSWORD';

const USERS = new Map<string, string>();
USERS.set('fhardy', 'Freddy Hardy');
USERS.set('ephilipp', 'Éric Philippe');
USERS.set('mcpuert', 'Maria-Claudia Puerta');
USERS.set('rleroy', 'Régis Leroy');
USERS.set('lmansoux', 'Liv Mansoux');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send('Missing username or password');
    return;
  }

  let userFullName = USERS.get(username);
  if (!userFullName) {
    res.status(404).send('User not found');
    return;
  }

  const match = await bcryptjs.compare(password, PASSWORD_HASH);
  if (match) {
    res.status(200).send({ username: username, name: userFullName });
  } else {
    res.status(401).send('Invalid password');
  }
});

// Middleware to serve all other routes with the content from 'public'
app.use((req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log('This PearNode is PearBroker Console Server');
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

const generatePassword = function (pass: string) {
  return bcryptjs.hashSync(pass, bcryptjs.genSaltSync(10));
};
