export function buildLocationContext(location = null) {
  if (!location?.latitude || !location?.longitude) {
    return "";
  }

  return `使用者目前瀏覽器定位：
緯度：${location.latitude}
經度：${location.longitude}

如果使用者問「我這裡」、「我目前位置」、「這裡天氣」，請優先使用這組經緯度。`;
}

export function weatherQueryFromLocation(location = null) {
  if (!location?.latitude || !location?.longitude) return null;
  return `${location.latitude},${location.longitude}`;
}
