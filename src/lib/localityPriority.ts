// Sin que haya ningún filtro de zona marcado, las vidrieras del sitio
// (Destacadas, Buscador de carreras) muestran surtido pensado primero para
// Santa Fe capital -- el resto de la provincia sigue totalmente buscable,
// solo que no encabeza el "surtido" por defecto.
const CAPITAL = "Santa Fe (Capital)";

export function isCapital(localidad: string): boolean {
  return localidad === CAPITAL;
}

export function capitalFirst<T>(items: T[], getLocalidad: (item: T) => string): T[] {
  return [...items].sort((a, b) => {
    const aCapital = isCapital(getLocalidad(a));
    const bCapital = isCapital(getLocalidad(b));
    if (aCapital === bCapital) return 0;
    return aCapital ? -1 : 1;
  });
}
