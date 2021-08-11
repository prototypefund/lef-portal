const DICTIONARY_DE = {
  aboutLef_text:
    "Über den Klimaschutz wird viel geredet - aber du fragst dich, was sich ganz konkret vor deiner Haustür tut? Was unternehmen deine Kommune, dein Kreis und die Unternehmen in deiner Region in Sachen Klima? Sind die Folgen des Klimawandels bereits bei dir zu spüren?\n\nWir erklären dir kurz und bündig, was bisher schon an Klimaschutzmaßnahmen passiert ist, wo wir gerade stehen und was in Zukunft noch geplant ist.",
};

const defaultDict = DICTIONARY_DE;

export const getString = (id) => defaultDict[id] || "";
