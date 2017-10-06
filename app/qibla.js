const kaba = { lat: 21.42251, long: 39.82616 };

class Qibla {
  getDirection(point1, point2) {
    function deg2rad(deg) {
      return Math.PI * deg / 180;
    }

    var lat1 = deg2rad(point1.lat);
    var lat2 = deg2rad(point2.lat);
    var dLng = deg2rad(point2.long) - deg2rad(point1.long);
    var angle = Math.atan2(Math.sin(dLng), Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng));
    return angle * 180.0 / Math.PI;
  }

  // reurn qibla direction for a given location
  direction(location) {
    var qiblaDir = this.getDirection(location, kaba);
    if (qiblaDir < 0) qiblaDir += 360;
    return qiblaDir;
  }
}

let qibla = new Qibla();
export default qibla;
