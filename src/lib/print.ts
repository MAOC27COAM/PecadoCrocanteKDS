import type { Pedido } from '../types';

function padRight(s: string, len: number): string {
  return (s + ' '.repeat(len)).slice(0, len);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} ${hh}:${mi}`;
}

function generateTicketHtml(pedido: Pedido): string {
  const lineItems = pedido.detalle.map((d) => ({
    name: `${d.cantidad}x ${d.producto.nombre}`,
    total: (Number(d.precioUnitario) * d.cantidad).toFixed(2),
  }));

  const maxItemLen = Math.max(...lineItems.map((i) => i.name.length), 20);
  const col2Width = 10;

  const rows = lineItems
    .map((i) => {
      const left = padRight(i.name, maxItemLen);
      const right = padRight(`S/ ${i.total}`, col2Width);
      return `    <tr><td>${left}</td><td class="r">${right}</td></tr>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Ticket - ${pedido.id.slice(0, 8)}</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 10px 14px;
    font-family: 'Courier New', 'Courier', monospace;
    font-size: 10px;
    color: #000;
    width: 80mm;
  }
  .center { text-align: center; }
  .title {
    font-size: 15px;
    font-weight: bold;
    margin: 0 0 2px;
    letter-spacing: 1px;
  }
  .sub {
    font-size: 11px;
    margin: 0 0 4px;
    font-weight: bold;
  }
  hr {
    border: none;
    border-top: 1px dashed #000;
    margin: 6px 0;
  }
  .info { font-size: 10px; margin: 0 0 0; }
  .info p { margin: 1px 0; }
  table { width: 100%; border-collapse: collapse; font-size: 10px; }
  td { padding: 1px 0; vertical-align: top; }
  td.r { text-align: right; white-space: nowrap; }
  .total-box { text-align: right; }
  .total-box .label { font-size: 10px; }
  .total-box .amount {
    font-size: 14px;
    font-weight: bold;
  }
  .total-box p { margin: 1px 0; }
  .eta { font-size: 10px; margin: 0; }
  .footer { text-align: center; font-size: 9px; margin-top: 4px; }
  .footer p { margin: 1px 0; }
  hr.double { border-top: 3px double #000; }
</style>
</head>
<body>
  <div class="center">
    <p class="title">PECADO CROCANTE</p>
    <p class="sub">TICKET DE COCINA</p>
  </div>
  <hr>
  <div class="info">
    <p><strong>Pedido:</strong> #${pedido.id.slice(0, 8)}</p>
    <p><strong>Fecha:</strong> ${formatDate(pedido.createdAt)}</p>
    <p><strong>Cliente:</strong> ${pedido.usuario.nombre}</p>
    <p><strong>Celular:</strong> ${pedido.usuario.celular}</p>
  </div>
  <hr>
  <table>
    <thead>
      <tr style="font-weight:bold"><td>Producto</td><td class="r">Importe</td></tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>
  <hr>
  <div class="total-box">
    <p><span class="label">TOTAL</span></p>
    <p class="amount">S/ ${Number(pedido.total).toFixed(2)}</p>
    ${pedido.tiempoEstimado ? `<p class="eta">Tiempo estimado: ${pedido.tiempoEstimado} min</p>` : ''}
  </div>
  <hr class="double">
  <div class="footer">
    <p>Gracias por preferir</p>
    <p>Pecado Crocante!</p>
  </div>
</body>
</html>`;
}

export function printTicket(pedido: Pedido) {
  const printWindow = window.open(
    '',
    'ticket-print',
    'width=400,height=600,menubar=no,toolbar=no,location=no,status=no,scrollbars=no'
  );

  if (!printWindow) {
    alert(
      'Permite ventanas emergentes para imprimir los tickets automáticamente.\n\n' +
        'O usa el boton 🖨️ en cada pedido para imprimir manualmente.'
    );
    return;
  }

  printWindow.document.write(generateTicketHtml(pedido));
  printWindow.document.close();
  printWindow.focus();

  printWindow.onafterprint = () => {
    printWindow.close();
  };

  setTimeout(() => {
    printWindow.print();
  }, 400);
}
