export type Dish = {
  name: string;
  description: string;
  price: string;
};

export type Section = {
  title: string;
  items: Dish[];
};

export const homeMenuPreview: Dish[] = [
  {
    name: "Œuf parfait",
    description: "Crème de petits pois, jambon de Bayonne",
    price: "14 €",
  },
  {
    name: "Tartare de daurade",
    description: "Citron Yuzu, huile d'olive de Provence",
    price: "16 €",
  },
  {
    name: "Burrata des Pouilles",
    description: "Tomates anciennes, basilic du jardin",
    price: "13 €",
  },
  {
    name: "Saint-Pierre rôti",
    description: "Beurre d'algues et fenouil braisé",
    price: "28 €",
  },
  {
    name: "Onglet de bœuf Black Angus",
    description: "Échalotes confites, frites maison",
    price: "26 €",
  },
  {
    name: "Risotto aux champignons des bois",
    description: "Parmesan affiné 24 mois, huile de truffe",
    price: "24 €",
  },
];

export const fullMenu: Section[] = [
  {
    title: "Entrées",
    items: [
      {
        name: "Œuf parfait",
        description: "Crème de petits pois, jambon de Bayonne, mouillettes briochées au beurre noisette",
        price: "14 €",
      },
      {
        name: "Tartare de daurade",
        description: "Citron Yuzu, huile d'olive de Provence, fleur de sel de Guérande",
        price: "16 €",
      },
      {
        name: "Burrata des Pouilles",
        description: "Tomates anciennes, basilic du jardin, vinaigre balsamique de Modène",
        price: "13 €",
      },
      {
        name: "Velouté de butternut",
        description: "Châtaignes rôties, huile de noisette du Périgord, croûtons à l'ail",
        price: "13 €",
      },
      {
        name: "Foie gras mi-cuit",
        description: "Chutney de figues, brioche maison toastée, fleur de sel et poivre Sichuan",
        price: "16 €",
      },
    ],
  },
  {
    title: "Plats",
    items: [
      {
        name: "Saint-Pierre rôti",
        description: "Beurre d'algues et fenouil braisé, condiment au citron confit",
        price: "28 €",
      },
      {
        name: "Onglet de bœuf Black Angus",
        description: "Échalotes confites au vin rouge, frites maison à la graisse de canard",
        price: "26 €",
      },
      {
        name: "Risotto aux champignons des bois",
        description: "Parmesan affiné 24 mois, huile de truffe blanche d'Alba",
        price: "24 €",
      },
      {
        name: "Cabillaud cuit basse température",
        description: "Risotto de céleri, sauce vierge à l'huile d'olive et tomates confites",
        price: "27 €",
      },
      {
        name: "Suprême de volaille fermière",
        description: "Jus à l'estragon frais, écrasé de pommes Ratte au beurre demi-sel",
        price: "23 €",
      },
      {
        name: "Côte de cochon Iberico",
        description: "Polenta crémeuse au parmesan, légumes glacés de saison",
        price: "28 €",
      },
      {
        name: "Pavé d'agneau",
        description: "Jus court à la sarriette, gratin dauphinois aux trois fromages",
        price: "30 €",
      },
    ],
  },
  {
    title: "Desserts",
    items: [
      {
        name: "Tarte fine aux abricots rôtis",
        description: "Glace verveine maison, amandes effilées caramélisées",
        price: "10 €",
      },
      {
        name: "Île flottante revisitée",
        description: "Crème anglaise à la vanille de Madagascar, praline maison",
        price: "9 €",
      },
      {
        name: "Soufflé au Grand Marnier",
        description: "Servi minute, sorbet orange sanguine",
        price: "12 €",
      },
      {
        name: "Sélection de fromages affinés",
        description: "Trois fromages choisis par le chef, chutney et pain aux noix",
        price: "11 €",
      },
    ],
  },
  {
    title: "Boissons",
    items: [
      {
        name: "Chablis 1er Cru — Domaine Laroche",
        description: "Verre 12 cl, Bourgogne, blanc minéral et tendu",
        price: "12 €",
      },
      {
        name: "Côtes-du-Rhône — Domaine Coulon",
        description: "Verre 12 cl, rouge épicé, syrah dominante",
        price: "8 €",
      },
      {
        name: "Sancerre — Domaine Vacheron",
        description: "Verre 12 cl, Loire, blanc sauvignon vif",
        price: "10 €",
      },
      {
        name: "Saint-Estèphe — Château Phélan Ségur",
        description: "Verre 12 cl, Bordeaux, rouge structuré",
        price: "14 €",
      },
      {
        name: "Champagne brut — Pierre Gimonnet",
        description: "Flûte 12 cl, blanc de blancs, Côte des Blancs",
        price: "13 €",
      },
      {
        name: "Spritz du bistrot",
        description: "Apérol, prosecco, eau gazeuse, zeste d'orange",
        price: "9 €",
      },
      {
        name: "Negroni maison",
        description: "Gin Plymouth, Campari, Vermouth Carpano Antica",
        price: "11 €",
      },
      {
        name: "Kir royal cassis Bourgogne",
        description: "Crème de cassis Lejay, champagne brut",
        price: "10 €",
      },
      {
        name: "Bellini saisonnier",
        description: "Purée de pêche blanche fraîche, prosecco",
        price: "9 €",
      },
      {
        name: "Thés Mariage Frères",
        description: "Earl Grey, Marco Polo, vert Sencha, infusion verveine",
        price: "5 €",
      },
      {
        name: "Café espresso",
        description: "Torréfaction Coutume, sélection Brésil et Éthiopie",
        price: "3 €",
      },
    ],
  },
];
