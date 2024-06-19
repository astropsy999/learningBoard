import { parse, format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

/**
 * Преобразует строку даты в формат dd.MM.yyyy.
 *
 * @param {string} dateStr - Строка даты.
 * @returns {string} Дата в формате dd.MM.yyyy.
 */
export const formatDate = (dateStr: string): string | null => {
  // Определяем формат входящей даты для русского и английского языков
  const ruInputDateFormat = 'd MMMM yyyy г. HH:mm';
  const enInputDateFormat = 'd MMMM yyyy HH:mm';

  try {
    // Проверяем, какой язык используется в строке даты
    const isRussian = /[а-яА-ЯЁё]/.test(dateStr); // Проверяем наличие русских символов

    // Парсим дату с использованием соответствующей локали
    const parsedDate = parse(
      dateStr,
      isRussian ? ruInputDateFormat : enInputDateFormat,
      new Date(),
      {
        locale: isRussian ? ru : enUS,
      }
    );

    // Форматируем дату в нужный формат
    const formattedDate = format(parsedDate, 'dd.MM.yyyy', {
      locale: isRussian ? ru : enUS,
    });

    return formattedDate;
  } catch (error) {
    console.error('Ошибка парсинга даты:', error);
    return null;
  }
};
