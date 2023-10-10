import axios from "axios";

export const calculateViewCounts = (stringNumber) => {
  const viewcounts = parseInt(stringNumber);

  if ((viewcounts > 999) & (viewcounts < 1000000)) {
    return (viewcounts / 1000).toFixed(1) + "K views";
  } else if ((viewcounts >= 1000000) & (viewcounts < 1000000000)) {
    return (viewcounts / 1000000).toFixed(1) + "M views";
  } else if (viewcounts >= 1000000000) {
    return (viewcounts / 1000000000).toFixed(1) + "B views";
  } else {
    return viewcounts.toString() + " views";
  }
};

export function CalculateLikeAndComment(number) {
  const getViews = calculateViewCounts(number);
  return getViews.slice(0, getViews.length - 5); //removing 'views' string
}

export const calculateTime = (timeInUTC) => {
  const time_Ago_in_secs = ((new Date() - new Date(timeInUTC)) / 1000).toFixed(
    0
  );
  const time_Ago_in_mins = (time_Ago_in_secs / 60).toFixed(0);
  const time_Ago_in_hours = (time_Ago_in_mins / 60).toFixed(0);
  const time_Ago_in_days = (time_Ago_in_hours / 24).toFixed(0);
  const time_ago_in_weeks = (time_Ago_in_days / 7).toFixed(0);
  const time_Ago_in_months = (time_Ago_in_days / 30).toFixed(0);
  const time_Ago_in_years = (time_Ago_in_months / 12).toFixed(0);

  if (time_Ago_in_years > 0) {
    return time_Ago_in_years + " years";
  } else if (time_Ago_in_months > 0) {
    return time_Ago_in_months + " months";
  } else if (time_ago_in_weeks > 0 && time_ago_in_weeks < 4) {
    if (time_Ago_in_days < 7) {
      return time_Ago_in_days + " days";
    } else {
      return time_ago_in_weeks + " weeks";
    }
  } else if (time_Ago_in_days > 0) {
    return time_Ago_in_days + " days";
  } else if (time_Ago_in_hours > 0) {
    return time_Ago_in_hours + " hours";
  } else if (time_Ago_in_mins > 0) {
    return time_Ago_in_mins + " mins";
  } else {
    return time_Ago_in_secs + " secs";
  }
};

// "PT2M44S"

export const parseISO8601Duration = (duration) => {
  const matches = duration.match(/[0-9]+[HMS]/g);

  let timeString = "";
  if (matches) {
    matches.forEach((match) => {
      const unit = match.charAt(match.length - 1);
      const value = parseInt(match.slice(0, -1));

      if (unit === "H") timeString += value + " hours ";
      else if (unit === "M") timeString += value + " mins ";
      else if (unit === "S") timeString += value + " secs ";
    });
  }
  return timeString.trim();
};

export function fetchLogosOfChannels(defaultData) {
  const newArrForIds = [];
  const api_key = process.env.REACT_APP_API_KEY;
  defaultData.map((obj) => {
    newArrForIds.push(obj.snippet.channelId); //collecting channelids
  });

  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${newArrForIds.toString()}&key=${api_key}`
      )
      .then((response) => {
        if (response.status === 200) {
          for (let i = 0; i < response.data.items.length; i++) {
            defaultData[i].urllogo =
              response.data.items[i].snippet.thumbnails.default.url;
          }
          resolve(defaultData);
        } else {
          reject("error is there");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
