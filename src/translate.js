import axios from 'axios';

const API_KEY = 'AIzaSyDBjO8VxwmNqBL8R0HlvQOXcbU9JV7bmi0';

export const translateText = async (text, targetLanguage) => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  try {
    const response = await axios.post(url, {
      q: text,
      target: targetLang,
      format: 'text'
    });
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
};
