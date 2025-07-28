// scripts/reportes.js

document.addEventListener("DOMContentLoaded", () => {
    const btnDia = document.getElementById("btnDia");
    const btnMes = document.getElementById("btnMes");
    const btnFiltro = document.getElementById("btnFiltro");
  
    btnDia.addEventListener("click", async () => {
      const fecha = prompt("Ingrese la fecha (YYYY-MM-DD):");
      if (fecha) {
        const data = await fetchReporteDia(fecha);
        mostrarResultados(data, "día");
      }
    });
  
    btnMes.addEventListener("click", async () => {
      const anio = prompt("Ingrese el año (YYYY):");
      const mes = prompt("Ingrese el mes (1-12):");
      if (anio && mes) {
        const data = await fetchReporteMes(anio, mes);
        mostrarResultados(data, "mes");
      }
    });
  
    btnFiltro.addEventListener("click", async () => {
      const inicio = prompt("Fecha de inicio (YYYY-MM-DD):");
      const fin = prompt("Fecha de fin (YYYY-MM-DD):");
      if (inicio && fin) {
        const data = await fetchReporteRango(inicio, fin);
        mostrarResultados(data, "rango");
      }
    });
  });
  
  // FUNCIONES FETCH
  
  async function fetchReporteDia(fecha) {
    try {
      const res = await fetch(`http://localhost:3000/api/reportes/dia/${fecha}`);
      return await res.json();
    } catch (err) {
      console.error("Error al obtener reporte por día:", err);
      return [];
    }
  }
  
  async function fetchReporteMes(anio, mes) {
    try {
      const res = await fetch(`http://localhost:3000/api/reportes/mes/${anio}/${mes}`);
      return await res.json();
    } catch (err) {
      console.error("Error al obtener reporte por mes:", err);
      return [];
    }
  }
  
  async function fetchReporteRango(inicio, fin) {
    try {
      const res = await fetch(`http://localhost:3000/api/reportes/rango?inicio=${inicio}&fin=${fin}`);
      return await res.json();
    } catch (err) {
      console.error("Error al obtener reporte por rango:", err);
      return [];
    }
  }
  
  // FUNCIONES PARA VISUALIZAR RESULTADOS
  
  function mostrarResultados(data, tipo) {
    const aceptadas = data.find(d => d.estado === "Aceptada");
    const totalAceptadas = aceptadas ? aceptadas.total : 0;
    alert(`Total solicitudes ACEPTADAS en el ${tipo} consultado: ${totalAceptadas}`);
  }
  