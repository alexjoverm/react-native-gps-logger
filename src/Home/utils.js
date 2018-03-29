export const toKnots = val => val * 1.9438444924574;
export const stateFromLocation = location => ({
  latitude: location.latitude.toFixed(6),
  longitude: location.longitude.toFixed(6),
  accuracy: location.accuracy.toFixed(2),
  speed: toKnots(location.speed).toFixed(2),
  cog: location.bearing.toFixed(2),
});
