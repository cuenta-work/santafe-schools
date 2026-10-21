// «Practicá para el ingreso»: preguntas PROPIAS de práctica, armadas a partir de los temas que figuran en los programas públicos de
// ingreso de las universidades (matemática, química, biología, física). No son exámenes oficiales ni salen de ellos.
// Cada pregunta: tema (para «qué repasar»), enunciado, opciones, la correcta (índice) y la explicación.
const P = (tema, q, op, ok, por) => ({ tema, q, op, ok, por });

export const AREAS = [
  { id: "matematica", n: "Matemática", preguntas: [
    P("Ecuaciones", "Si 2x + 5 = 17, ¿cuánto vale x?", ["5", "6", "11", "22"], 1, "2x = 17 − 5 = 12, entonces x = 6."),
    P("Expresiones algebraicas", "¿A qué es igual (a + b)²?", ["a² + b²", "a² + 2ab + b²", "2a + 2b", "a² − 2ab + b²"], 1, "Es el cuadrado de un binomio: a² + 2ab + b²."),
    P("Funciones lineales", "¿Cuál es la pendiente de la recta que pasa por (1, 2) y (3, 8)?", ["2", "3", "4", "6"], 1, "Pendiente = (8 − 2) / (3 − 1) = 6 / 2 = 3."),
    P("Ecuaciones cuadráticas", "¿Cuáles son las soluciones de x² − 5x + 6 = 0?", ["1 y 6", "−2 y −3", "2 y 3", "−1 y 6"], 2, "x² − 5x + 6 = (x − 2)(x − 3), así que x = 2 o x = 3."),
    P("Logaritmos", "¿Cuánto vale log₁₀(1000)?", ["2", "3", "10", "100"], 1, "10³ = 1000, entonces log₁₀(1000) = 3."),
    P("Trigonometría", "¿Cuánto vale sen(30°)?", ["1/2", "√2/2", "√3/2", "1"], 0, "sen(30°) = 1/2."),
    P("Porcentajes", "¿Cuánto es el 25 % de 80?", ["15", "20", "25", "32"], 1, "25 % = 1/4, y 80 / 4 = 20."),
    P("Funciones", "Si f(x) = 3x − 4, ¿cuánto vale f(2)?", ["−2", "2", "6", "10"], 1, "f(2) = 3 · 2 − 4 = 2."),
    P("Expresiones algebraicas", "Para x ≠ 3, ¿a qué es igual (x² − 9) / (x − 3)?", ["x − 3", "x + 3", "x² − 3", "x + 9"], 1, "x² − 9 = (x − 3)(x + 3); al simplificar queda x + 3."),
    P("Geometría", "¿Cuál es el área de un círculo de radio 3?", ["3π", "6π", "9π", "12π"], 2, "Área = π · r² = π · 9 = 9π."),
    P("Potencias", "¿Cuánto es 2³ · 2⁴?", ["2¹²", "2⁷", "4⁷", "2"], 1, "Mismo base: se suman los exponentes, 2³⁺⁴ = 2⁷ = 128."),
    P("Valor absoluto", "¿Qué valores de x cumplen |x − 2| = 5?", ["Solo 7", "7 y −3", "3 y −7", "Solo −3"], 1, "x − 2 = 5 → x = 7, o x − 2 = −5 → x = −3."),
  ] },
  { id: "quimica", n: "Química", preguntas: [
    P("Estructura atómica", "¿Qué indica el número atómico (Z) de un elemento?", ["La cantidad de neutrones", "La cantidad de protones", "La masa del átomo", "La cantidad de moléculas"], 1, "Z es la cantidad de protones del núcleo; define al elemento."),
    P("Ácidos y bases", "Una solución con pH 3 es…", ["ácida", "neutra", "básica", "salina"], 0, "pH menor que 7 es ácido; 7 neutro; mayor que 7 básico."),
    P("Fórmulas", "¿Cuántos átomos de oxígeno hay en una molécula de CO₂?", ["1", "2", "3", "4"], 1, "El subíndice 2 indica dos átomos de oxígeno."),
    P("Enlaces químicos", "¿Qué tipo de enlace hay en el cloruro de sodio (NaCl)?", ["Covalente", "Iónico", "Metálico", "Puente de hidrógeno"], 1, "Se transfiere un electrón del sodio al cloro: enlace iónico."),
    P("Mol y masa molar", "Con H = 1 y O = 16, ¿cuál es la masa molar del agua (H₂O)?", ["17 g/mol", "18 g/mol", "32 g/mol", "34 g/mol"], 1, "2 · 1 + 16 = 18 g/mol."),
    P("Estructura atómica", "Los isótopos de un mismo elemento se diferencian en…", ["el número de protones", "el número de neutrones", "el número de electrones de valencia", "el símbolo químico"], 1, "Tienen igual cantidad de protones y distinta cantidad de neutrones."),
    P("Mol y masa molar", "¿Cuántas partículas hay en un mol?", ["6,02 × 10²³", "6,02 × 10²⁰", "1000", "22,4"], 0, "Es el número de Avogadro: 6,02 × 10²³."),
    P("Tabla periódica", "¿Cuál de estos elementos es un gas noble?", ["Sodio (Na)", "Cloro (Cl)", "Neón (Ne)", "Oxígeno (O)"], 2, "El neón está en el grupo 18, el de los gases nobles."),
    P("Reacciones químicas", "La combustión completa del metano (CH₄) con oxígeno produce…", ["CO y H₂", "CO₂ y H₂O", "C y H₂O", "CH₃OH"], 1, "CH₄ + 2 O₂ → CO₂ + 2 H₂O."),
    P("Estados de la materia", "¿Cómo se llama el paso directo de sólido a gas?", ["Fusión", "Evaporación", "Sublimación", "Condensación"], 2, "Pasar de sólido a gas sin pasar por líquido es sublimación."),
    P("Tabla periódica", "Los elementos de un mismo grupo de la tabla periódica tienen…", ["la misma masa", "la misma cantidad de electrones en la última capa", "el mismo número de neutrones", "el mismo número atómico"], 1, "Por eso tienen propiedades químicas parecidas."),
    P("Reacciones químicas", "En una reacción redox, la oxidación es…", ["ganar electrones", "perder electrones", "ganar protones", "perder neutrones"], 1, "Oxidación: pérdida de electrones; reducción: ganancia."),
  ] },
  { id: "biologia", n: "Biología", preguntas: [
    P("Célula", "¿En qué organela ocurre la respiración celular?", ["Ribosoma", "Mitocondria", "Aparato de Golgi", "Lisosoma"], 1, "La mitocondria produce la mayor parte del ATP de la célula."),
    P("Fotosíntesis", "¿Dónde ocurre la fotosíntesis en las células vegetales?", ["En las mitocondrias", "En los cloroplastos", "En el núcleo", "En las vacuolas"], 1, "Los cloroplastos tienen la clorofila que capta la luz."),
    P("Célula", "En las células eucariotas, el ADN se encuentra principalmente en…", ["el citoplasma", "la membrana", "el núcleo", "los ribosomas"], 2, "El núcleo guarda la mayor parte del material genético."),
    P("Niveles de organización", "¿Cuál es la unidad básica de la vida?", ["El átomo", "La molécula", "La célula", "El tejido"], 2, "La célula es la unidad estructural y funcional de los seres vivos."),
    P("División celular", "¿Qué resulta de una mitosis?", ["4 células con la mitad de cromosomas", "2 células genéticamente iguales", "1 célula más grande", "2 gametos"], 1, "La mitosis da dos células hijas iguales a la madre."),
    P("Genética", "¿Cuáles son las bases nitrogenadas del ADN?", ["A, U, C, G", "A, T, C, G", "A, T, U, G", "C, G, U, T"], 1, "Adenina, timina, citosina y guanina (el ARN tiene uracilo en vez de timina)."),
    P("Biomoléculas", "Las proteínas están formadas por…", ["nucleótidos", "aminoácidos", "ácidos grasos", "monosacáridos"], 1, "Los aminoácidos se unen por enlaces peptídicos."),
    P("Célula", "¿Qué caracteriza a una célula procariota?", ["Tiene núcleo definido", "No tiene núcleo definido", "Tiene cloroplastos siempre", "Es siempre pluricelular"], 1, "En las procariotas el material genético no está rodeado por una membrana nuclear."),
    P("Genética", "¿Cuántos cromosomas tiene un gameto humano?", ["23", "46", "22", "92"], 0, "Los gametos son haploides: 23 cromosomas."),
    P("Biomoléculas", "Las enzimas son…", ["reservas de energía", "catalizadores biológicos", "hormonas sexuales", "componentes del ADN"], 1, "Aceleran las reacciones químicas de la célula; la mayoría son proteínas."),
    P("Célula", "¿Cuál es la función de los ribosomas?", ["Producir energía", "Sintetizar proteínas", "Almacenar agua", "Digerir sustancias"], 1, "En los ribosomas se arman las proteínas."),
    P("Célula", "La membrana plasmática está formada principalmente por…", ["una pared de celulosa", "una bicapa de fosfolípidos con proteínas", "almidón", "ADN"], 1, "Es el modelo de mosaico fluido: fosfolípidos y proteínas."),
  ] },
  { id: "fisica", n: "Física", preguntas: [
    P("Cinemática", "Un auto recorre 120 km en 2 horas. ¿Cuál es su velocidad media?", ["40 km/h", "60 km/h", "120 km/h", "240 km/h"], 1, "v = distancia / tiempo = 120 km / 2 h = 60 km/h."),
    P("Unidades", "¿Cuál es la unidad de fuerza en el Sistema Internacional?", ["Joule", "Newton", "Watt", "Pascal"], 1, "1 N = 1 kg · m/s²."),
    P("Dinámica", "Una masa de 2 kg acelera a 3 m/s². ¿Qué fuerza neta actúa?", ["1,5 N", "5 N", "6 N", "9 N"], 2, "F = m · a = 2 · 3 = 6 N."),
    P("Gravedad", "¿Cuál es aproximadamente la aceleración de la gravedad en la Tierra?", ["1 m/s²", "9,8 m/s²", "98 m/s²", "0,98 m/s²"], 1, "g ≈ 9,8 m/s² (en muchos ejercicios se redondea a 10)."),
    P("Energía", "¿Cuál es la energía cinética de un cuerpo de 2 kg que va a 3 m/s?", ["3 J", "6 J", "9 J", "18 J"], 2, "Ec = ½ · m · v² = ½ · 2 · 9 = 9 J."),
    P("Unidades", "¿Cuál es la unidad de energía en el Sistema Internacional?", ["Newton", "Joule", "Watt", "Volt"], 1, "1 J = 1 N · m."),
    P("Cinemática", "¿A cuántos m/s equivalen 72 km/h?", ["7,2 m/s", "20 m/s", "36 m/s", "259 m/s"], 1, "72 km/h ÷ 3,6 = 20 m/s."),
    P("Electricidad", "Por una resistencia de 4 Ω con 12 V aplicados, ¿qué corriente circula?", ["3 A", "8 A", "16 A", "48 A"], 0, "Ley de Ohm: I = V / R = 12 / 4 = 3 A."),
    P("Gravedad", "Con g = 10 m/s², ¿cuánto pesa un cuerpo de 10 kg?", ["1 N", "10 N", "100 N", "1000 N"], 2, "P = m · g = 10 · 10 = 100 N."),
    P("Presión", "La presión es la fuerza dividida por…", ["el volumen", "el área", "la masa", "el tiempo"], 1, "p = F / A; se mide en pascales (N/m²)."),
    P("Cinemática", "En un movimiento rectilíneo uniforme (MRU), la aceleración es…", ["constante y distinta de cero", "cero", "variable", "igual a la velocidad"], 1, "En el MRU la velocidad no cambia, así que no hay aceleración."),
    P("Energía", "Una fuerza de 10 N mueve un objeto 5 m en su misma dirección. ¿Qué trabajo hace?", ["2 J", "15 J", "50 J", "500 J"], 2, "W = F · d = 10 · 5 = 50 J."),
  ] },
];
// Dónde están los contenidos y fechas oficiales (siempre mandamos ahí).
export const OFICIALES = [
  { n: "Universidad Nacional del Litoral (UNL)", url: "https://www.unl.edu.ar" },
  { n: "Universidad Nacional de Rosario (UNR)", url: "https://unr.edu.ar" },
  { n: "UTN Facultad Regional Santa Fe", url: "https://www.frsf.utn.edu.ar" },
];
export function armarSimulacro(areaId, n = 10) {
  const a = AREAS.find((x) => x.id === areaId);
  if (!a) return [];
  const l = a.preguntas.map((p, i) => ({ ...p, id: `${a.id}-${i}` }));
  for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; }
  return l.slice(0, n);
}
