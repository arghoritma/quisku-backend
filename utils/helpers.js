const formatPhoneNumber = (phone) => {
  let formattedPhone = phone.trim();

  if (formattedPhone.startsWith("08")) {
    formattedPhone = "62" + formattedPhone.substring(1);
  } else if (formattedPhone.startsWith("+62")) {
    formattedPhone = "62" + formattedPhone.substring(3);
  }

  return formattedPhone;
};

const cleanJsonString = (jsonString) => {
  const cleaned = jsonString.replace(/```json\n|\n```/g, "");
  return JSON.parse(cleaned);
};

const convertJSON = (jsonData) => {
  return jsonData.map((item) => {
    return {
      question: item.question,
      options: item.options,
      correct_answer: item.correct_answer,
    };
  });
};

module.exports = {
  formatPhoneNumber,
  cleanJsonString,
  convertJSON,
};
