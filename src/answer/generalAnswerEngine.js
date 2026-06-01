const DEFAULT_LOCATION = "台北";

function detectLocation(question = "") {
  const locations = [
    "台北", "新北", "桃園", "台中", "台南", "高雄", "基隆", "新竹",
    "宜蘭", "花蓮", "台東", "嘉義", "彰化", "南投", "苗栗", "屏東"
  ];

  for (const location of locations) {
    if (question.includes(location)) return location;
  }

  if (question.includes("我在哪") || question.includes("我的位置")) {
    return null;
  }

  return DEFAULT_LOCATION;
}

function isWeatherQuestion(question = "") {
  return question.includes("天氣") || question.toLowerCase().includes("weather");
}

function isLocationQuestion(question = "") {
  return question.includes("我在哪") || question.includes("我的位置") || question.includes("目前位置");
}

function isStockQuestion(question = "") {
  return question.includes("股票") || question.includes("股市") || question.includes("台積電") || question.includes("聯發科");
}

function isTravelQuestion(question = "") {
  return question.includes("去哪") || question.includes("景點") || question.includes("旅遊") || question.includes("走走");
}

async function getWeather(location) {
  const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "vincent-ai-command-center"
    }
  });

  if (!response.ok) {
    throw new Error("weather fetch failed");
  }

  const data = await response.json();
  const current = data.current_condition?.[0];
  const today = data.weather?.[0];

  if (!current || !today) {
    throw new Error("weather data unavailable");
  }

  return {
    location,
    temperature: current.temp_C,
    feelsLike: current.FeelsLikeC,
    humidity: current.humidity,
    weather: current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || "",
    high: today.maxtempC,
    low: today.mintempC,
    rainChance: today.hourly?.[4]?.chanceofrain || today.hourly?.[0]?.chanceofrain || "N/A"
  };
}

export async function answerGeneralQuestion(question = "") {
  if (isLocationQuestion(question)) {
    return "我目前不能直接讀取你電腦的精確位置。依照目前使用情境，我先預設你在台北。之後可以加入位置設定功能。";
  }

  if (isWeatherQuestion(question)) {
    const location = detectLocation(question) || DEFAULT_LOCATION;

    try {
      const weather = await getWeather(location);

      return `${weather.location}目前天氣：${weather.weather}
溫度：約 ${weather.temperature}°C
體感：約 ${weather.feelsLike}°C
今日高低溫：約 ${weather.low}°C 到 ${weather.high}°C
濕度：約 ${weather.humidity}%
降雨機率：約 ${weather.rainChance}%

建議：天氣偏濕，出門可帶雨具。`;
    } catch {
      return `${location}天氣目前無法即時查詢。請稍後再試，或改用瀏覽器查詢即時天氣。`;
    }
  }

  if (isStockQuestion(question)) {
    return "股票問題需要即時股價與新聞資料。這類問題之後會接股票查詢工具，目前不要用多AI討論亂猜。";
  }

  if (isTravelQuestion(question)) {
    return "旅遊問題可以直接回答，但若要推薦地點，我需要知道出發地、交通方式與時間。你可以直接問：台北開車半天去哪裡？";
  }

  return "這是一般問題，我會直接回答，不啟動多AI討論。請把問題再寫具體一點。";
}
