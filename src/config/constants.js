const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export const BADMINTON_SHOTS = [
  { id: 'short_forehand', label: 'Short Forehand', src: asset('images/badminton_shots/short_forehand.png') },
  { id: 'short_backhand', label: 'Short Backhand', src: asset('images/badminton_shots/short_backhand.png') },
  { id: 'late_forehand', label: 'Late Forehand', src: asset('images/badminton_shots/late_forehand.png') },
  { id: 'late_backhand', label: 'Late Backhand', src: asset('images/badminton_shots/late_backhand.png') },
];

export const CALLS_TO_ACTION = [
  "Return a drop",
  "Return a clear",
  "Smash!",
  "Lift it high",
];
