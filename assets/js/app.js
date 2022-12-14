const monto = document.querySelector("#monto");
const moneda = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const ctx = document.querySelector("#myChart");
const loading = document.querySelector("#loading");

//Capturamos el Formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (moneda.value == "Seleccione Opción") {
    //console.log("mal")
    resultado.innerHTML = `
      <p>No ha indicado el tipo de moneda a convertir!</p>
      `;
    return;
  }

  try {
    loading.classList.remove("d-none");
    const res = await fetch("https://mindicador.cl/api/");
    if (!res.ok) throw "Fallo de Conección"; // validamos la respuesta de la consulta, y lo enviamos al catch
    const data = await res.json(); // validamos la respuesta a la consulta
    // console.log(data[moneda.value].valor);
    let result = monto.value / data[moneda.value].valor;
    let redondeado = roundToTwo(result); //redondeamos la cantidad en 2 decimales
    // console.log(redondeado);

    resultado.innerHTML = `
      <h4>Resultado: ${redondeado} </h4>
      `;

    renderChart(moneda.value);
  } catch (error) {
    console.log(error);
    resultado.innerHTML = `
      <p>${error}</p>
      `;
  } finally {
    loading.classList.add("d-none");
  }
});

//funcion para redondear la cantidad
function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

//Declaramos variable de la gráfica
let grafica;

// Generamos el Gráfico y pintamos
const renderChart = async (moneda) => {
  try {
    const datagrafic = await fetch(`https://mindicador.cl/api/${moneda}`);
    if (!datagrafic.ok)
      throw "Problemas al generar el gráfico. Intentelo nuevamente mas tarde."; // validamos la respuesta de la consulta
    const resgrafic = await datagrafic.json();

    const arraydiezdias = resgrafic.serie.slice(0, 10).reverse(); //obtenemos las series (días), y la ordenamos en forma inversa
    const labels = arraydiezdias.map(
      (item) => item.fecha.split("T")[0].split("-").reverse().join("-") // Formatamos la fechas recividas del array
    );
    const datadiezdias = arraydiezdias.map((item) => item.valor);

    if (grafica) {
      // Verificamos si ya tenemos el gráfico generado, lo destruimos para generarlo nuevamente
      grafica.destroy();
    }
    grafica = new Chart(ctx, {
      // Generamos el grafico
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Comportamiento de: " + moneda + " de los últimos diez días",
            data: datadiezdias,
            backgroundColor: "#FFB1C1",
            borderColor: "#FF6384",
            borderWidth: 1,
          },
        ],
      },
    });
  } catch (error) {
    // console.log(error);
    errorGrafic.innerHTML = `
      <p>${error}</p>
      `;
  }
};
