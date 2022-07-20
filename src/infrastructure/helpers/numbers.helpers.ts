export function toDecimal(percent): number {
  const parsed = parseFloat(percent);

  if (!Number.isNaN(parsed)) {
    return +(parseFloat(percent) / 100).toPrecision(4);
  } else {
    return 0;
  }
}

/// ColumnNumericTransformer
export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}
