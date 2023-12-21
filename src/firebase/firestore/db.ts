import {
  collection,
  addDoc,
  query,
  getDoc,
  doc,
  writeBatch,
  getFirestore,
  increment,
  getDocs,
  where,
} from "firebase/firestore";
import firebase_app from "../config";
import { sha256 } from "js-sha256";

const db = getFirestore(firebase_app);

type surl = {
  url: string;
  owner: string;
  created_at: number;
  stats: {
    clicks: number;
  };
};

export const createShortURL = async (_url: string, _owner: string = "None") => {
  const regexCut = /((\w+:)\/\/)?(www.)?(.+)/;
  const rawUrl = _url.match(regexCut);
  console.log(rawUrl);
  if (rawUrl === null) {
    return;
  }
  const extracted = rawUrl[4];
  const urlHash = sha256(extracted);
  const batch = writeBatch(db);
  const urlRef = collection(db, "short_urls");
  const surldocRef = doc(urlRef);

  //Add a new short url
  const newDoc = {
    url: _url,
    owner: _owner,
    created_at: Date.now(),
    stats: {
      clicks: 0,
    },
  } as surl;
  batch.set(surldocRef, newDoc);
  const surlKey = surldocRef.id;
  console.log(surlKey);

  const longUrlRef = collection(db, "long_urls");
  const lurlDocRef = doc(longUrlRef, urlHash);

  //Updates long url with the main url
  batch.set(lurlDocRef, {
    surlCount: increment(1),
    main: encodeURI(extracted),
  });

  if (_owner !== "None") {
    //Adds user private link information
    const userRef = collection(db, "users");
    const userDocRef = doc(userRef, _owner);
    batch.set(userDocRef, {
      stats: {
        numberOfPrivateLinks: increment(1),
      },
    });

    //Updates long url with owner
    batch.update(lurlDocRef, {
      surls: {
        [surlKey]: _owner,
      },
    });
  } else {
    //Updates long url with domain public
    batch.update(lurlDocRef, {
      surls: {
        [surlKey]: "public",
      },
    });
  }

  await batch.commit();
};

export const getSURLS = async (_url: string, _owner: string = "public") => {
  const regexCut = /((\w+:)\/\/)?(www.)?(.+)/;
  const rawUrl = _url.match(regexCut);
  console.log(rawUrl);
  if (rawUrl === null) {
    return;
  }
  const extracted = rawUrl[4];
  const urlHash = sha256(extracted);
  //console.log(rawUrl[4], "see");
  const longUrlRef = collection(db, "long_urls");
  const longUrlQuery = query(longUrlRef, where("main", "==", extracted));
  //   const lurlDocRef = doc(longUrlRef, urlHash);
  const lurlSnapshot = await getDocs(longUrlQuery);
  const surls: { [key: string]: string }[] = [];
  if (!lurlSnapshot.empty) {
    lurlSnapshot.forEach((doc) => {
      const url = doc.data().surls;
      Object.keys(url).forEach(function (k) {
        //Push if public link
        if (url[k] === "public") {
          surls.push({
            [k]: url[k],
          });
          //Push if owner's link
        } else if (url[k] === _owner) {
          surls.push({
            [k]: url[k],
          });
        }
      });
      console.log("Checking SURL");
      console.log(surls);
    });
    return surls;
  }

  //   if (lurlDoc.exists()) {
  //     const surls: { [key: string]: string }[] = [];
  //     const lurl = lurlDoc.data().surls;
  //     Object.keys(lurl).forEach(function (k) {
  //       //Push if public link
  //       if (lurl[k] === "public") {
  //         surls.push({
  //           [k]: lurl[k],
  //         });
  //         //Push if owner's link
  //       } else if (lurl[k] === _owner) {
  //         surls.push({
  //           [k]: lurl[k],
  //         });
  //       }
  //     });
  //     console.log(surls);
  //     return surls;
  // if (_owner === "public") {
  //   lurlDoc.data()?.forEach((doc: any) => {
  //     console.log(doc.id, " => ", doc.data());
  //   });
  // } else {
  // }
  // if (lurlData.surls) {
  //   const surlKey = Object.keys(lurlData.surls).find(
  //     (key) => lurlData.surls[key] === _owner
  //   );
  //   if (surlKey) {
  //     const surlRef = collection(db, "short_urls");
  //     const surldocRef = doc(surlRef, surlKey);
  //     const surlDoc = await surldocRef.get();
  //     if (surlDoc.exists()) {
  //       const surlData = surlDoc.data();
  //       return surlData;
  //     }
  //   }
  // }
  //   }
};

export const redirectURL = async (_surl: string) => {
  // const surlRef = query(ref(db,'short_url/'),orderByKey(),startAt(_url),endAt(_url+"\uf8ff"))
  const shortUrlRef = collection(db, "short_urls");
  const surlDocRef = doc(shortUrlRef, _surl);
  const querySnapshot = await getDoc(surlDocRef);

  if (querySnapshot.exists()) {
    // const surlDoc = querySnapshot.docs[0];
    const surlData = querySnapshot.data();
    console.log(surlData);
    return surlData;
  }
};
