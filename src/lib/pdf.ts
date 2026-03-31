function escapePdfText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapLine(value: string, maxLength = 62) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length <= maxLength) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function createPdfDocument(objects: string[]) {
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${offsets[index].toString().padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function formatPdfDate(value: string) {
  return value.replace(/[:.]/g, "-");
}

function sanitizeFileNamePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

type PdfTextStyle = "regular" | "bold";

function estimatePdfTextWidth(text: string, size: number, style: PdfTextStyle = "regular") {
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const weightFactor = style === "bold" ? 0.58 : 0.53;
  return normalized.length * size * weightFactor;
}

function pdfText(
  x: number,
  y: number,
  text: string,
  size: number,
  style: PdfTextStyle = "regular",
  color: [number, number, number] = [0.1, 0.16, 0.24],
) {
  const font = style === "bold" ? "/F2" : "/F1";
  const [r, g, b] = color;

  return [
    "BT",
    `${font} ${size} Tf`,
    `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`,
    `1 0 0 1 ${x} ${y} Tm`,
    `(${escapePdfText(text)}) Tj`,
    "ET",
  ].join("\n");
}

function pdfRect(
  x: number,
  y: number,
  width: number,
  height: number,
  fill: [number, number, number],
  stroke?: [number, number, number],
) {
  const commands = ["q"];

  if (stroke) {
    commands.push(
      `${stroke[0].toFixed(3)} ${stroke[1].toFixed(3)} ${stroke[2].toFixed(3)} RG`,
      `${fill[0].toFixed(3)} ${fill[1].toFixed(3)} ${fill[2].toFixed(3)} rg`,
      `${x} ${y} ${width} ${height} re B`,
    );
  } else {
    commands.push(
      `${fill[0].toFixed(3)} ${fill[1].toFixed(3)} ${fill[2].toFixed(3)} rg`,
      `${x} ${y} ${width} ${height} re f`,
    );
  }

  commands.push("Q");
  return commands.join("\n");
}

function drawWrappedText(
  lines: string[],
  x: number,
  startY: number,
  size: number,
  lineHeight: number,
  style: PdfTextStyle,
  color: [number, number, number],
) {
  return lines.map((line, index) => pdfText(x, startY - index * lineHeight, line, size, style, color));
}

function pdfBadge(
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  fill: [number, number, number],
  textColor: [number, number, number],
) {
  const textSize = 10;
  const textWidth = estimatePdfTextWidth(text, textSize, "bold");
  const textX = x + Math.max((width - textWidth) / 2, 12);
  const textY = y + (height - textSize) / 2 + 3;

  return [
    pdfRect(x, y, width, height, fill),
    pdfText(textX, textY, text, textSize, "bold", textColor),
  ];
}

export function createSimplePdf(title: string, rows: Array<{ label: string; value: string }>) {
  const contentLines: string[] = [
    "BT",
    "/F1 20 Tf",
    "50 790 Td",
    `(${escapePdfText(title)}) Tj`,
    "ET",
  ];

  let currentY = 754;

  for (const row of rows) {
    const wrappedValue = wrapLine(row.value || "-");
    const renderedLines = [`${row.label}: ${wrappedValue[0] ?? "-"}`, ...wrappedValue.slice(1)];

    for (const line of renderedLines) {
      contentLines.push(
        "BT",
        "/F1 12 Tf",
        `50 ${currentY} Td`,
        `(${escapePdfText(line)}) Tj`,
        "ET",
      );
      currentY -= 18;
    }

    currentY -= 8;
  }

  const stream = contentLines.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
  ];

  return createPdfDocument(objects);
}

interface TransactionDetailsPdfData {
  recipientName: string;
  email: string;
  typeLabel: string;
  statusLabel: string;
  amountLabel: string;
  createdAtLabel: string;
  description: string;
}

interface TransactionPdfField {
  label: string;
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
  accentColor?: [number, number, number];
}

export function createTransactionDetailsPdf(data: TransactionDetailsPdfData) {
  const pageWidth = 595;
  const pageHeight = 842;
  const cardX = 44;
  const cardY = 72;
  const cardWidth = pageWidth - cardX * 2;
  const cardHeight = 684;
  const brandHeaderHeight = 78;
  const sectionHeaderHeight = 122;
  const sectionHeaderY = pageHeight - cardY - brandHeaderHeight - sectionHeaderHeight;
  const contentTop = sectionHeaderY - 40;
  const fieldWidth = 214;
  const fieldHeight = 92;
  const fieldGap = 18;
  const leftX = cardX + 26;
  const rightX = leftX + fieldWidth + fieldGap;
  const badgeY = sectionHeaderY + 18;
  const typeBadgeX = cardX + 26;
  const typeBadgeWidth = 94;
  const statusBadgeWidth = 114;
  const badgeGap = 14;
  const statusBadgeX = typeBadgeX + typeBadgeWidth + badgeGap;

  const fields: TransactionPdfField[] = [
    {
      label: "Nome",
      value: data.recipientName,
      x: leftX,
      y: contentTop - fieldHeight,
      width: fieldWidth,
      height: fieldHeight,
    },
    {
      label: "E-mail",
      value: data.email,
      x: rightX,
      y: contentTop - fieldHeight,
      width: fieldWidth,
      height: fieldHeight,
    },
    {
      label: "Tipo",
      value: data.typeLabel,
      x: leftX,
      y: contentTop - (fieldHeight + fieldGap) * 2 + fieldGap,
      width: fieldWidth,
      height: fieldHeight,
    },
    {
      label: "Status",
      value: data.statusLabel,
      x: rightX,
      y: contentTop - (fieldHeight + fieldGap) * 2 + fieldGap,
      width: fieldWidth,
      height: fieldHeight,
    },
    {
      label: "Valor",
      value: data.amountLabel,
      accentColor: data.typeLabel === "Saida" ? [0.882, 0.114, 0.282] : [0.020, 0.639, 0.451],
      x: leftX,
      y: contentTop - (fieldHeight + fieldGap) * 3 + fieldGap * 2,
      width: fieldWidth,
      height: fieldHeight,
    },
    {
      label: "Data e hora",
      value: data.createdAtLabel,
      x: rightX,
      y: contentTop - (fieldHeight + fieldGap) * 3 + fieldGap * 2,
      width: fieldWidth,
      height: fieldHeight,
    },
    {
      label: "Descricao",
      value: data.description || "Sem descricao",
      x: leftX,
      y: cardY + 34,
      width: fieldWidth * 2 + fieldGap,
      height: 116,
    },
  ];

  const contentLines: string[] = [
    pdfRect(0, 0, pageWidth, pageHeight, [0.965, 0.976, 0.992]),
    pdfRect(cardX, cardY, cardWidth, cardHeight, [1, 1, 1], [0.839, 0.882, 0.941]),
    pdfRect(cardX, pageHeight - cardY - brandHeaderHeight, cardWidth, brandHeaderHeight, [0.059, 0.090, 0.165]),
    pdfRect(cardX, sectionHeaderY, cardWidth, sectionHeaderHeight, [0.969, 0.984, 1]),
    pdfText(cardX + 26, pageHeight - cardY - 28, "Onda Finance", 18, "bold", [1, 1, 1]),
    pdfText(cardX + 26, pageHeight - cardY - 49, "Relatorio oficial de detalhes da transacao", 10, "regular", [0.792, 0.866, 0.941]),
    pdfText(cardX + 26, sectionHeaderY + 82, "Detalhes da transacao", 21, "bold", [0.059, 0.090, 0.165]),
    pdfText(cardX + 26, sectionHeaderY + 58, "Comprovante visual alinhado ao modal exibido no sistema.", 10, "regular", [0.392, 0.455, 0.545]),
  ];

  contentLines.push(
    ...pdfBadge(typeBadgeX, badgeY, typeBadgeWidth, 28, data.typeLabel, [0.862, 0.949, 1], [0.008, 0.518, 0.780]),
    ...pdfBadge(statusBadgeX, badgeY, statusBadgeWidth, 28, data.statusLabel, [0.867, 0.980, 0.922], [0.051, 0.647, 0.396]),
  );

  for (const field of fields) {
    contentLines.push(
      pdfRect(field.x, field.y, field.width, field.height, [0.973, 0.980, 0.988], [0.886, 0.914, 0.949]),
      pdfText(field.x + 16, field.y + field.height - 24, field.label.toUpperCase(), 8, "bold", [0.392, 0.455, 0.545]),
    );

    const maxLength = field.label === "Descricao" ? 70 : 28;
    const valueLines = wrapLine(field.value || "-", maxLength).slice(0, field.label === "Descricao" ? 4 : 3);
    const accentColor = field.accentColor ?? [0.059, 0.090, 0.165];

    contentLines.push(
      ...drawWrappedText(
        valueLines,
        field.x + 16,
        field.y + field.height - 48,
        field.label === "Valor" ? 16 : 12,
        field.label === "Descricao" ? 16 : 14,
        "bold",
        accentColor,
      ),
    );
  }

  contentLines.push(
    pdfText(
      cardX + 26,
      cardY + 14,
      `Arquivo gerado para download local em ${formatPdfDate(data.createdAtLabel)}`,
      9,
      "regular",
      [0.392, 0.455, 0.545],
    ),
  );

  const stream = contentLines.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj",
    `6 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
  ];

  return createPdfDocument(objects);
}

export function createTransactionPdfFileName(recipientName: string, createdAt: string) {
  const namePart = sanitizeFileNamePart(recipientName) || "transacao";
  return `detalhe-transacao-${namePart}-${formatPdfDate(createdAt)}.pdf`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}
