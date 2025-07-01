const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const sitiosRoutes = require('./routes/sitios');
const solicitudesRoutes = require('./routes/solicitudes');
const reportesRoutes = require ('./routes/reportes');
const swaggerDocs = require("./swagger");


const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  });
  
  // Luego el middleware estático
  app.use(express.static(path.join(__dirname, 'public')));
  

app.use('/api', authRoutes);
app.use('/api', sitiosRoutes);
app.use('/api', solicitudesRoutes);
app.use('/api', reportesRoutes);

swaggerDocs(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
