export function isValidBase64(str: string): boolean {
  if (typeof str !== "string") {
    return false;
  }
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

export function isValidDateFormat(dateStr: string): boolean {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateStr)) {
    return false;
  }

  const date = new Date(dateStr);
  return date.toISOString().startsWith(dateStr);
}

export function IsValidMeasureType(measure_type: string): boolean {
  if (measure_type) {
    measure_type = (measure_type as string).toUpperCase();
    if (measure_type !== "WATER" && measure_type !== "GAS") {
      return false;
    }
  }

  return true;
}
