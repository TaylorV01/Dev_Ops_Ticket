const express = require('express');
const cors    = require('cors');
const { sequelize, Ticket } = require('./models');

const app = express();
app.use(cors(), express.json());

// 1) Crear ticket
app.post('/tickets', async (req, res) => {
  const { title, description } = req.body;
  const t = await Ticket.create({ title, description });
  res.status(201).json(t);
});

// 2) Listar tickets (con tiempo usado)
app.get('/tickets', async (_, res) => {
  const all = await Ticket.findAll();
  const now = new Date();
  const withDuration = all.map(t => {
    const created = new Date(t.createdAt);
    const diffMs  = now - created;
    const hours   = Math.floor(diffMs/3600000);
    const minutes = Math.floor((diffMs%3600000)/60000);
    return {
      id: t.id,
      title: t.title,
      status: t.status,
      createdAt: t.createdAt,
      duration: `${hours}h ${minutes}m`
    };
  });
  res.json(withDuration);
});

// 3 & 4) Obtener uno, actualizar estado
app.put('/tickets/:id', async (req, res) => {
  const { status } = req.body;
  const t = await Ticket.findByPk(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  t.status = status;
  await t.save();
  res.json(t);
});

// Sincronizar DB y arrancar
sequelize.sync().then(() => {
  app.listen(4000, () => console.log('API en http://localhost:4000'));
});
