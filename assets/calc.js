function calc() {
  const hoursNotWork = document.getElementById("subhours").value;
  if (hoursNotWork != 0) {
    const totalHours = 40 / (5 - hoursNotWork);
    document.getElementById("output").innerHTML =
      `Hours you must work per day: ${totalHours}`;
  }
}
