/**
 * Arabic Number to Words Converter
 * A utility to convert numbers into Arabic formal written form
 */

export function numberToArabicWords(number: number): string {
  if (number === 0) return 'صفر';
  if (number < 0) return 'سالب ' + numberToArabicWords(Math.abs(number));

  const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  
  let words = '';

  if (number >= 1000000000) {
    const billions = Math.floor(number / 1000000000);
    if (billions === 1) words += 'مليار ';
    else if (billions === 2) words += 'ملياران ';
    else if (billions <= 10) words += numberToArabicWords(billions) + ' مليارات ';
    else words += numberToArabicWords(billions) + ' مليار ';
    number %= 1000000000;
  }

  if (number >= 1000000) {
    if (words) words += 'و ';
    const millions = Math.floor(number / 1000000);
    if (millions === 1) words += 'مليون ';
    else if (millions === 2) words += 'مليونان ';
    else if (millions <= 10) words += numberToArabicWords(millions) + ' ملايين ';
    else words += numberToArabicWords(millions) + ' مليون ';
    number %= 1000000;
  }

  if (number >= 1000) {
    if (words) words += 'و ';
    const thousands = Math.floor(number / 1000);
    if (thousands === 1) words += 'ألف ';
    else if (thousands === 2) words += 'ألفان ';
    else if (thousands <= 10) words += numberToArabicWords(thousands) + ' آلاف ';
    else words += numberToArabicWords(thousands) + ' ألف ';
    number %= 1000;
  }

  if (number >= 100) {
    if (words) words += 'و ';
    const h = Math.floor(number / 100);
    words += hundreds[h] + ' ';
    number %= 100;
  }

  if (number > 0) {
    if (words && words.trim() !== '') words += 'و ';
    if (number <= 10) {
      words += units[number];
    } else if (number < 20) {
      words += teens[number - 10];
    } else {
      const u = number % 10;
      const t = Math.floor(number / 10);
      if (u === 0) {
        words += tens[t];
      } else {
        words += units[u] + ' و' + tens[t];
      }
    }
  }

  return words.trim();
}

export function formatCurrencyArabic(amount: number): string {
    if (isNaN(amount) || amount === 0) return '';
    return numberToArabicWords(Math.floor(amount)) + ' ريال يمني';
}
