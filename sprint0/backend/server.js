const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const sitiosRoutes = require('./routes/sitios');
const solicitudesRoutes = require('./routes/solicitudes');
const reportesRoutes = require('./routes/reportes');
const swaggerDocs = require("./swagger");
const { sequelize } = require('./models');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // o más, si fuera necesario


// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas de API
app.use('/api', authRoutes);
app.use('/api', sitiosRoutes);
app.use('/api', solicitudesRoutes);
app.use('/api', reportesRoutes);

// Swagger docs
swaggerDocs(app);
if (require.main === module) {
  sequelize.authenticate()
    .then(() => console.log('✅ Conectado correctamente a PostgreSQL con Sequelize'))
    .catch(err => console.error('❌ Error de conexión:', err));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}


module.exports = app; 
