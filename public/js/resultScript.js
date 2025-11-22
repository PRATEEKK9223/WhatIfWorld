
    let labels = [];
    let values = [];

    // ✅ Check if data is nested (like 'all') or flat (like 'education')
    const isNested = Object.values(stats)[0] && typeof Object.values(stats)[0] === 'object';

    if (isNested) {
      // Flatten nested domains (for "All" option)
      for (const domain in stats) {
        for (const key in stats[domain]) {
          labels.push(`${domain} - ${key}`);
          values.push(stats[domain][key]);
        }
      }
    } else {
      // Flat object (for single domain)
      labels = Object.keys(stats);
      values = Object.values(stats);
    }

    // If some values are large (like 95, 80 etc.), don’t multiply by 100 again
    const adjustValues = values.some(v => v > 1) ? values : values.map(v => v * 100);

    const ctx = document.getElementById('scenarioChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Impact (%)',
          data: adjustValues,
          backgroundColor: [
            '#8b5cf6', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
            '#f43f5e', '#14b8a6', '#eab308', '#9333ea', '#f97316', '#0ea5e9', '#22c55e'
          ],
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
         maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#f9fafb',
            bodyColor: '#f9fafb'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...adjustValues) > 100 ? undefined : 100,
            title: {
              display: true,
              text: 'Impact Level (%)'
            }
          },
          x: {
            ticks: { font: { size: 11 }, maxRotation: 90, minRotation: 45 }
          }
        }
      }
    });

    const ctx2 = document.getElementById('scenarioChart-pie').getContext('2d');
    new Chart(ctx2, {
      type: 'doughnut',//pie
      data: {
        labels: labels,
        datasets: [{
          label: 'Impact (%)',
          data: adjustValues,
          backgroundColor: [
            '#8b5cf6', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'
          ],
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#f9fafb',
            bodyColor: '#f9fafb'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...adjustValues) > 100 ? undefined : 100,
            title: {
              display: true,
              text: 'Impact Level (%)'
            }
          },
          x: {
            ticks: { font: { size: 11 }, maxRotation: 90, minRotation: 45 }
          }
        }
      }
    });


// Frontend
const barCanvas = document.getElementById('scenarioChart');
const pieCanvas = document.getElementById('scenarioChart-pie');


barCanvas.toBlob(async (barBlob) => {
  pieCanvas.toBlob(async (pieBlob) => {
    const formData = new FormData();
    formData.append('barChart', barBlob, 'barChart.png');
    formData.append('pieChart', pieBlob, 'pieChart.png');
    formData.append('resultId', resultId);

    await fetch('/upload-chart', {
      method: 'POST',
      body: formData
    });
  });
});

// PDF Download
document.getElementById('downloadPDF').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;

    const container = document.querySelector('.container');

    // IMPORTANT FIX: Remove any transform/overflow that breaks screenshot
    container.style.overflow = "visible";
    container.style.maxHeight = "none";

    // Force full-height rendering
    const canvas = await html2canvas(container, {
        scale: 3,               // High quality
        useCORS: true,
        allowTaint: true,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // MULTI-PAGE FIX
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - pdfHeight;
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save("scenario-result.pdf");
});







