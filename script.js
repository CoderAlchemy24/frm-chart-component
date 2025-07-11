const bars = document.querySelectorAll(".barchart__item-bar");
const tooltips = document.querySelectorAll(".barchart__item-tooltip");

function getTodayAsNumber() {
  const today = new Date();
  return today.getDay(); // 0 = vasárnap, 1 = hétfő, ..., 6 = szombat
}

async function getData() {
  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

// Chart inicializálása
async function initChart() {
  try {
    const expensesData = await getData();
    console.log("Expenses data:", expensesData);

    // Diagramok létrehozása az adatok alapján
    bars.forEach((bar, index) => {
      if (expensesData[index]) {
        const amount = expensesData[index].amount;
        const day = expensesData[index].day;

        // Bar magasság beállítása
        bar.style.height = `${amount * 4}px`;

        // Tooltip vagy label hozzáadása
        bar.title = `${day}: $${amount}`;

        //mai nap kiemelése
        if (getTodayAsNumber() === index + 1) {
          bar.classList.add("today");

          bar.addEventListener("mouseover", () => {
            bar.classList.add("hovered");
          });
          bar.addEventListener("mouseout", () => {
            bar.classList.remove("hovered");
          });
        } else if (getTodayAsNumber() === 0 && index === 6) {
          bar.classList.add("today"); // vasárnap kiemelése
          bar.addEventListener("mouseover", () => {
            bar.classList.add("hovered");
          });
          bar.addEventListener("mouseout", () => {
            bar.classList.remove("hovered");
          });
        }
      }
    });

    tooltips.forEach((tooltip, index) => {
      if (expensesData[index]) {
        const amount = expensesData[index].amount;

        // Tooltip szöveg beállítása
        tooltip.textContent = `$${amount}`;
      }
    });
  } catch (error) {
    console.error("Failed to load expenses data:", error);
  }
}

// Betöltéskor futtatás
document.addEventListener("DOMContentLoaded", initChart);
