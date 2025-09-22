// src/utils/playSound.js

let audio;

export const playNotificationSound = (type = 'notification') => {
  const soundPath = `/sounds/${type}.mp3`;

  // Create a new audio object or reuse existing one
  if (!audio) {
    audio = new Audio(soundPath);
  } else {
    audio.pause();
    audio.currentTime = 0;
    audio.src = soundPath; // Switch source
  }

  audio.play().catch((err) => {
    console.error('Playback failed', err);
  });
};
