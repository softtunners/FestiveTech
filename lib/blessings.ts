export interface Blessing {
  id: number;
  sanskritShloka: string;
  transliteration: string;
  text: (name: string) => string;
  hindi: string;
  closing: string;
}

export interface GeneratedBlessing {
  id: number;
  sanskritShloka: string;
  transliteration: string;
  personalizedText: string;
  hindi: string;
  closing: string;
  recipientName: string;
}

export const BLESSINGS: Blessing[] = [
  {
    id: 1,
    sanskritShloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ",
    transliteration: "Vakratunda Mahakaya Suryakoti Samaprabha",
    text: (name) =>
      `प्रिय ${name}, भगवान गणेश — सभी विघ्नों को हरने वाले — आपको अनंत सुख, उत्तम स्वास्थ्य और अटूट सफलता का आशीर्वाद दें। आपके मार्ग की हर बाधा दूर हो और बाप्पा की कृपा आपको आपके सर्वोच्च लक्ष्य तक पहुंचाए।`,
    hindi: "बाप्पा आपके जीवन की सभी बाधाएं दूर करें और सुख-समृद्धि प्रदान करें।",
    closing: "गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!",
  },
  {
    id: 2,
    sanskritShloka: "श्री गणेशाय नमः। सिद्धिविनायक प्रसन्न",
    transliteration: "Shri Ganeshaya Namah. Siddhivinayaka Prasanna",
    text: (name) =>
      `${name}, भगवान सिद्धिविनायक आप पर और आपके परिवार पर अपनी दिव्य कृपा बरसाएं। आपके दिन आंतरिक शांति, उल्लास और समृद्धि से भरे रहें। बाप्पा सदा आपके रक्षक और मार्गदर्शक बनें।`,
    hindi: "सिद्धिविनायक की कृपा दृष्टि सदैव आप पर बनी रहे।",
    closing: "गणपती बाप्पा मोरया!",
  },
  {
    id: 3,
    sanskritShloka: "ॐ गं गणपतये नमः। विघ्नहर्ता प्रसीद",
    transliteration: "Om Gam Ganapataye Namah. Vighnaharta Prasida",
    text: (name) =>
      `${name}, गणेश चतुर्थी के इस पावन अवसर पर बाप्पा का आगमन आपके घर में मोदक जैसी मिठास, उत्सव का उल्लास और चिरस्थायी वैभव लाए। उनका आशीर्वाद आपको ज्ञान और सुख से भर दे।`,
    hindi: "आपके घर में सुख, शांति और समृद्धि का वास हो।",
    closing: "बाप्पा मोरया! पुढच्या वर्षी लवकर या!",
  },
  {
    id: 4,
    sanskritShloka: "प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम्",
    transliteration: "Pranamya Shirasa Devam Gauriputram Vinayakam",
    text: (name) =>
      `${name}, भगवान गणेश आपके मन को हजारों सूर्यों से भी तेज ज्ञान से प्रकाशित करें, आपके हृदय को पर्वत-सा साहस दें, और आपके जीवन के हर कदम पर आपकी रक्षा करें। बाप्पा आपकी सफलता का मार्ग सुगम करें।`,
    hindi: "बुद्धि के देवता गणपती बाप्पा आपको यश और ज्ञान प्रदान करें।",
    closing: "गणपती बाप्पा मोरया!",
  },
  {
    id: 5,
    sanskritShloka: "एकदन्ताय विद्महे वक्रतुण्डाय धीमहि",
    transliteration: "Ekadantaya Vidmahe Vakratundaya Dhimahi",
    text: (name) =>
      `${name}, बाप्पा की दिव्य उपस्थिति आपके घर को हंसी, प्रेम और असीम सौहार्द से भर दे। आपकी हर प्रार्थना सुनी जाए, आपकी हर आकांक्षा पूरी हो, और आपका परिवार गणेश जी की शाश्वत छत्रछाया में रहे।`,
    hindi: "बाप्पा का आशीर्वाद आपके परिवार पर सदैव बना रहे।",
    closing: "मंगलमूर्ती मोरया! गणपती बाप्पा मोरया!",
  },
];

export const FRIEND_BLESSINGS: Array<(toName: string, fromName?: string) => string> = [
  (toName, fromName) =>
    `गणेश चतुर्थी की हार्दिक शुभकामनाएं, ${toName}!${fromName ? ` ${fromName} ने यह विशेष आशीर्वाद आपके लिए भेजा है।` : ""} बाप्पा आपके जीवन की हर बाधा दूर करें, आपके परिवार की रक्षा करें, और आपको असीम शांति तथा समृद्धि प्रदान करें।`,
  (toName, fromName) =>
    `प्रिय ${toName}, ${fromName ? `${fromName} आपको` : "आपको"} गणेश चतुर्थी की हार्दिक बधाई देते हैं! भगवान सिद्धिविनायक आपके सभी सपने पूरे करें और अपनी दिव्य कृपा आपके सम्पूर्ण परिवार पर बरसाएं।`,
];

export function getRandomBlessing(name: string): GeneratedBlessing {
  const b = BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)];
  return {
    id: b.id,
    sanskritShloka: b.sanskritShloka,
    transliteration: b.transliteration,
    personalizedText: b.text(name),
    hindi: b.hindi,
    closing: b.closing,
    recipientName: name,
  };
}

export function getFriendBlessing(toName: string, fromName?: string) {
  const fn = FRIEND_BLESSINGS[Math.floor(Math.random() * FRIEND_BLESSINGS.length)];
  return {
    recipientName: toName,
    senderName: fromName || "",
    personalizedText: fn(toName, fromName),
    closing: "गणपती बाप्पा मोरया!",
  };
}
