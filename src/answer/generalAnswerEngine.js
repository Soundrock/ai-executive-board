import fs from "fs";

const settingsFile = "data/user-settings.json";
const fallbackLocation = "台北";

function readDefaultLocation() {
  try {
    if (!fs.existsSync(settingsFile)) return fallbackLocation;
    const data = JSON.parse(fs.readFileSync(settingsFile, "utf8"));
    return data.defaultLocation || fallbackLocation;
  } catch {
    return fallbackLocation;
  }
}

function detectLocation(question = "") {
  const locations = [
    "台北", "新北", "桃園", "台中", "台南", "高雄", "基隆", "新竹",
    "宜蘭", "花蓮", "台東", "嘉義", "彰化", "南投", "苗栗", "屏東"
  ];

  for (const location of locations) {
    if (question.includes(location)) return location;
  }

  return readDefaultLocation();
}

function isWeatherQuestion(question = "") {
  return question.includes("天氣") || question.toLowerCase().includes("weather");
}

function isForecastQuestion(question = "") {
  return question.includes("未來") || question.includes("七天") || question.includes("7天") || question.includes("一週") || question.includes("本週");
}

function isLocationQuestion(question = "") {
  return question.includes("我在哪") || question.includes("我的位置") || question.includes("目前位置");
}

function isLocationSettingQuestion(question = "") {
  return question.includes("位置設定") || question.includes("設定位置") || question.includes("預設位置");
}

function isStockQuestion(question = "") {
  return question.includes("股票") || question.includes("股市") || question.includes("台積電") || question.includes("聯發科");
}

function isTravelQuestion(question = "") {
  return question.includes("去哪") || question.includes("景點") || question.includes("旅遊") || question.includes("走走");
}

async function getWeather(location) {
  const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;
  const response = await fetch(url, { headers: { "User-Agent": "vincent-ai-command-center" } });
  if (!response.ok) throw new Error("weather fetch failed");

  const data = await response.json();
  const current = data.current_condition?.[0];
  const today = data.weather?.[0];

  if (!current || !today) throw new Error("weather data unavailable");

  return { data, current, today, location };
}

function formatCurrentWeather(weather) {
  const current = weather.current;
  const today = weather.today;

  return `${weather.location}目前天氣：
天氣：${current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || ""}
溫度：約 ${current.temp_C}°C
體感：約 ${current.FeelsLikeC}°C
今日高低溫：約 ${today.mintempC}°C 到 ${today.maxtempC}°C
濕度：約 ${current.humidity}%
降雨機率：約 ${today.hourly?.[4]?.chanceofrain || today.hourly?.[0]?.chanceofrain || "N/A"}%

建議：天氣偏濕，出門可帶雨具。`;
}

function formatForecast(weather) {
  const days = weather.data.weather || [];

  const lines = days.slice(0, 7).map(day => {
    const desc = day.hourly?.[4]?.lang_zh?.[0]?.value || day.hourly?.[4]?.weatherDesc?.[0]?.value || "";
    const rain = day.hourly?.[4]?.chanceofrain || day.hourly?.[0]?.chanceofrain || "N/A";
    return `${day.date}：${desc}，${day.mintempC}°C 到 ${day.maxtempC}°C，降雨機率約 ${rain}%`;
  });

  return `${weather.location}未來七天天氣：

${lines.join("\n")}

建議：如果降雨機率偏高，出門帶雨具。`;
}

export async function answerGeneralQuestion(question = "") {
  if (isLocationSettingQuestion(question)) {
    return `目前可以先把你的預設位置存在系統設定中。

現在系統預設位置是：${readDefaultLocation()}

下一步我會加入指令：
設定我的位置為台北

之後你問天氣時，就會自動用這個位置。`;
  }

  if (isLocationQuestion(question)) {
    return `我目前不能直接讀取你電腦的精確位置。

目前系統預設位置是：${readDefaultLocation()}

之後可以加入「設定我的位置為台北」功能，讓系統記住你的常用位置。`;
  }

  if (isWeatherQuestion(question)) {
    const location = detectLocation(question);

    try {
      const weather = await getWeather(location);
      if (isForecastQuestion(question)) return formatForecast(weather);
      return formatCurrentWeather(weather);
    } catch {
      return `${location}天氣目前無法即時查詢。請稍後再試。`;
    }
  }

  if (isStockQuestion(question)) {
    return "股票問題需要即時股價與新聞資料。這類問題之後會接股票查詢工具，目前不要用多AI討論亂猜。";
  }

  if (isTravelQuestion(question)) {
    return "旅遊問題可以直接回答，但需要你告訴我出發地、交通方式與時間。例如：台北開車半天去哪裡？";
  }

  return "這是一般問題，但目前沒有足夠資訊直接回答。請把問題再寫具體一點。";
}
