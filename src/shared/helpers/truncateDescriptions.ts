export function truncateDescription(description: string) {
  // Удаляем HTML-теги из описания
  const plainText = description.replace(/(<([^>]+)>)/gi, '');
  // Разделяем строку на слова
  const words = plainText.split(' ');
  // Выбираем первые 20 слов
  const truncatedWords = words.slice(0, 20);
  // Объединяем слова обратно в строку и добавляем троеточие в конце
  const truncatedDescription =
    truncatedWords.join(' ') + (words.length > 20 ? '...' : '');
  return truncatedDescription;
}
