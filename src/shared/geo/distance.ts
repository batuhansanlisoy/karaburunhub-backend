/**
 * Haversine formülü ile iki koordinat arasındaki mesafeyi hesaplar.
 * 
 * @param lat1 - Birinci noktanın enlemi (decimal, derece cinsinden)
 * @param lon1 - Birinci noktanın boylamı (decimal, derece cinsinden)
 * @param lat2 - İkinci noktanın enlemi (decimal, derece cinsinden)
 * @param lon2 - İkinci noktanın boylamı (decimal, derece cinsinden)
 * @returns Mesafeyi hem metre hem kilometre cinsinden döner.
 *          Örnek: { meters: 1234.56, km: 1.23456 }
 */
export function getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): { meters: number; km: number } {

  // Dünya yarıçapı (metre)
    const earthRadius = 6371000;

    // Dereceyi radyana çevir
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const deltaLatRad = toRadians(lat2 - lat1);
    const deltaLonRad = toRadians(lon2 - lon1);

    // Haversine formülü
    const a =
        Math.sin(deltaLatRad / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(deltaLonRad / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceMeters = earthRadius * c;
    const distanceKm = distanceMeters / 1000;

    return {
        meters: distanceMeters,
        km: distanceKm,
    };
}
