/* eslint-disable max-len */
import * as functions from "firebase-functions";
import admin = require("firebase-admin");
import axios = require("axios");

admin.initializeApp();

const db = admin.firestore();

interface APOD{
  date: Date;
  url: string;
  title: string;
  // eslint-disable-next-line camelcase
  media_type: string;
  copyright: string;
}
interface WOTD{
  apod: APOD;
  word: string;
  id?: string;
}


// eslint-disable-next-line max-len
export const wordOfTheDay = functions.https.onRequest(async (request, response) => {
  const currentWOTD = await new Promise<WOTD|null>((resolve) => {
    db.collection("words").doc("today").
        get().then(async (docSnapshot) => {
          let wotd: WOTD;
          if (docSnapshot.exists) {
            wotd = docSnapshot.data() as WOTD;
          } else {
            wotd = await fetchWOTD() as WOTD;
            if (wotd) {
              wotd.id = "today";
              docSnapshot.ref.set(wotd);
            }
          }
          resolve(wotd);
        });
  });
  response.set({"Access-Control-Allow-Origin": "*"}).status(200).send(currentWOTD);
});

exports.updateWOTD = functions.pubsub.schedule("every day 00:00").timeZone("Africa/Johannesburg").onRun(async () => {
  const wotd = await fetchWOTD() as WOTD;
  console.log("Updating WOTD at", new Date().toLocaleDateString());
  functions.logger.log("Word of the day is:", wotd);
  return db.collection("words").doc("today").set(wotd);
});

const fetchWOTD = async () => {
  const apod = await fetchAPOD();
  const word = await fetchDatamuseWord();
  const date = new Date();
  return {word, date, apod} as WOTD;
};

const fetchAPOD = async () => {
  const apodURL = functions.config().apod.full_url as string;
  const apod = await axios.default.get<APOD>(apodURL).then((res)=> {
    return res.data as APOD;
  }).catch((error) => console.log(error));

  return apod;
};

const fetchDatamuseWord = async () => {
  const triggerWord = await db.collection("words").doc("today").get().then((snapshot) => {
    let currentWord = "hello";
    if (snapshot.exists) {
      const wotd = snapshot.data() as WOTD;
      currentWord = wotd.word;
    }
    return currentWord;
  });

  const dataMuseUrl = `https://api.datamuse.com/words?rel_trg=${triggerWord}&max=50`;
  const word = await axios.default.get<{word: string, score: number}[]>(dataMuseUrl).then((res)=> {
    const words = res.data.map((wordObject) => wordObject.word);
    const index = Math.floor(Math.random() * words.length);
    return words[index];
  }).catch((error) => {
    console.log(error);
    return triggerWord;
  });

  return word;
};
