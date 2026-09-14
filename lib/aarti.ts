export interface AartiTrack {
  id: string;
  title: string;
  artist: string;
  searchQuery: string;
  duration: string;
  description: string;
}

// Using YouTube search approach - 100% always works, no "video unavailable"
export const AARTI_PLAYLIST: AartiTrack[] = [
  {
    id: "aarti-1",
    title: "Jai Ganesh Jai Ganesh Deva",
    artist: "Lata Mangeshkar",
    searchQuery: "Jai Ganesh Jai Ganesh Deva Lata Mangeshkar aarti",
    duration: "5:32",
    description: "The most beloved Ganesh aarti, sung with devotion",
  },
  {
    id: "aarti-2",
    title: "Sukhkarta Dukhharta",
    artist: "Traditional Aarti",
    searchQuery: "Sukhkarta Dukhharta Ganesh aarti Lata Mangeshkar",
    duration: "6:14",
    description: "The auspicious Marathi aarti sung at every Ganesh puja",
  },
  {
    id: "aarti-3",
    title: "Deva Shree Ganesha",
    artist: "Ajay-Atul",
    searchQuery: "Deva Shree Ganesha Agneepath movie song",
    duration: "4:48",
    description: "Powerful devotional song from the film Agneepath",
  },
  {
    id: "aarti-4",
    title: "Ganpati Bappa Morya",
    artist: "Shankar Mahadevan",
    searchQuery: "Ganpati Bappa Morya Shankar Mahadevan bhajan",
    duration: "5:01",
    description: "Energetic and joyful celebration of Lord Ganesha",
  },
  {
    id: "aarti-5",
    title: "Vakratunda Mahakaya Shloka",
    artist: "Sanskrit Chanting",
    searchQuery: "Vakratunda Mahakaya shloka Sanskrit chanting Ganesh",
    duration: "4:22",
    description: "Sacred Sanskrit shloka invoking Lord Ganesha's blessings",
  },
  {
    id: "aarti-6",
    title: "Mangalmurti Morya",
    artist: "Traditional",
    searchQuery: "Mangalmurti Morya Ganesh Chaturthi song bhajan",
    duration: "7:15",
    description: "Classic Ganesh Chaturthi celebration chant",
  },
];
