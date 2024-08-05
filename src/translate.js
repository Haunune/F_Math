// translate.js
import axios from 'axios';

const API_KEY = 'AIzaSyDBjO8VxwmNqBL8R0HlvQOXcbU9JV7bmi0';

export const translateText = async (text, targetLanguage) => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  const response = await axios.post(url, {
    q: text,
    target: targetLanguage
  });

  return response.data.data.translations[0].translatedText;
};
