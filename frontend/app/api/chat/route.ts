import { NextResponse } from "next/server";

const kpiBank: Record<string, string> = {
  // kpiBank.ts

  "taux de rebut": `
**KPI : Taux de Rebut**

🔹 **Définition :**
Le taux de rebut représente le pourcentage de pièces ou produits rejetés car non conformes aux critères de qualité exigés. Ces produits ne peuvent pas être vendus ou utilisés sans retouche ou retraitement.

🧮 **Formule :**
Taux de Rebut (%) = (Nombre de pièces rebutées / Nombre total de pièces produites) × 100

🔍 **Types de rebuts :**
- **Rebuts visibles** (fissures, défauts d’assemblage, déformations)
- **Rebuts fonctionnels** (produit ne répondant pas à la spécification d’usage)
- **Rebuts esthétiques** (aspect non conforme)
- **Rebuts temporaires** (dus à un réglage de démarrage ou à une instabilité passagère)

⚠️ **Causes fréquentes (interne/externe) :**
🔧 Causes techniques :
- Mauvais réglage de machine (pression, température, vitesse)
- Outillage usé, mal positionné ou inadapté
- Variabilité dans le process (vibration, usure non détectée)

👨‍🏭 Causes humaines :
- Manque de formation ou qualification des opérateurs
- Erreurs de manipulation, oubli d’étapes critiques
- Non-respect des procédures de contrôle ou de montage

📦 Causes matière :
- Matière première de mauvaise qualité ou humidité inappropriée
- Variabilité fournisseur (tolérances non respectées)

🏭 Causes organisationnelles :
- Procédures obsolètes ou mal définies
- Mauvaise communication entre services (qualité, production, maintenance)
- Temps de réaction lent face aux écarts

🛠️ **Méthodes d’analyse des rebuts :**
- Diagramme d'Ishikawa (ou causes-effets)
- Méthode des 5 pourquoi
- Pareto des défauts
- Audit de poste ou analyse terrain
- SPC (Statistical Process Control)

✅ **Actions correctives recommandées :**
🔧 Techniques :
- Réglage précis et étalonnage régulier des machines
- Maintenance préventive + TPM (Total Productive Maintenance)
- Investir dans des systèmes de détection automatisée des défauts

👥 Humaines :
- Formation continue ciblée sur les erreurs récurrentes
- Implication des opérateurs dans les routines de contrôle
- Création de fiches de contrôle visuel simples et claires

📘 Organisationnelles :
- Création de routines QRQC ou TOP5 rebuts
- Revue systématique des ordres de fabrication vs écarts de qualité
- Collaboration renforcée entre Qualité / Production / Méthodes

📈 **Suivi & Amélioration continue :**
- Mettre en place des indicateurs temps réel
- Challenger les standards : pourquoi ce rebut existe encore ?
- Automatiser le suivi des défauts pour faire du prédictif

Ce KPI est essentiel pour garantir la rentabilité, réduire les gaspillages et améliorer la satisfaction client.
`,

  "taux de production": `
**KPI : Taux de Production**

🔹 **Définition :**
Le taux de production mesure l'efficacité d'une ligne ou d'une machine à produire des unités sur une période donnée par rapport à sa capacité maximale théorique.

🧮 **Formule :**
Taux de Production (%) = (Nombre de pièces produites / Capacité de production théorique) × 100

🔍 **Types de pertes impactant ce taux :**
- Arrêts non planifiés
- Micro-arrêts
- Ralentissements machine
- Changements de séries

⚠️ **Causes fréquentes :**
🔧 Techniques :
- Machines obsolètes ou souvent en panne
- Manque de pièces détachées ou de maintenance préventive
- Temps de démarrage long ou instable

👷 Humaines :
- Manque d’opérateurs qualifiés
- Non-respect des temps de cycle
- Mauvaise coordination entre postes

🗂 Organisationnelles :
- Mauvaise planification de production
- Manque de standardisation des processus
- Manque de disponibilité des matières premières

🛠️ **Méthodes d’analyse :**
- Chronométrage poste
- OEE (TRS)
- Analyse des temps d’arrêt
- Études de temps et mouvements

✅ **Actions correctives :**
🔧 Techniques :
- Améliorer les réglages et les démarrages
- Maintenance préventive renforcée
- Automatisation des tâches répétitives

👥 Humaines :
- Formation au respect du temps de cycle
- Mise en place de standards visuels

📘 Organisationnelles :
- Planification fine selon le takt time
- Synchronisation des flux de production

📈 **Amélioration continue :**
- Indicateurs visuels sur ligne (Andon)
- Déploiement de la méthode SMED (réduction des changements)
- Analyse hebdomadaire des causes de sous-performance
`,

  "taux de conformité": `
**KPI : Taux de Conformité**

🔹 **Définition :**
Le taux de conformité indique le pourcentage de produits sortants qui répondent entièrement aux spécifications qualité définies.

🧮 **Formule :**
Taux de Conformité (%) = (Nombre de produits conformes / Nombre total de produits contrôlés) × 100

🔍 **Critères de conformité :**
- Dimensions
- Fonctionnalités
- Esthétique
- Sécurité

⚠️ **Causes de non-conformité :**
🔧 Techniques :
- Réglages incorrects
- Usure d’outillage
- Variabilité du process

👨‍🏭 Humaines :
- Contrôles mal réalisés
- Manque de vigilance ou surcharge opérateur
- Documentation mal comprise

📦 Matières :
- Défaut de matière première
- Mauvais stockage

🏭 Organisationnelles :
- Procédures obsolètes
- Absence d’audits réguliers

🛠️ **Méthodes d’analyse :**
- Carte de contrôle qualité
- Audit qualité
- Pareto des défauts
- 5M / Ishikawa

✅ **Actions correctives :**
🔧 Techniques :
- Amélioration des paramètres process
- Surveillance accrue des postes critiques

👥 Humaines :
- Formation renforcée sur les critères qualité
- Mise à disposition d’outils de mesure fiables

📘 Organisationnelles :
- Déploiement des standards qualité
- Collaboration Qualité / Production

📈 **Amélioration continue :**
- Revues de non-conformités
- Standardisation des contrôles visuels
`,

  "production cible": `
**KPI : Production Cible**
---
🔹 **Définition :**
La production cible est le volume de production attendu ou planifié à produire sur une période donnée. Elle sert de référence pour mesurer la performance réelle.
---
🧮 **Formule :**
Écart à la cible = Production Réelle – Production Cible
---
🔍 **Utilité :**
- Fixer des objectifs clairs
- Évaluer les écarts de performance
- Motiver les équipes
---
⚠️ **Causes d’écart à la cible :**
🔧 Techniques :
- Pannes machines
- Réglages longs ou instables
---
👨‍🏭 Humaines :
- Absences ou sous-effectif
- Retards de prise de poste
---
🗂 Organisationnelles :
- Planification irréaliste
- Retards fournisseurs
- Changements de priorité
---
🛠️ **Méthodes de suivi :**
- Board de pilotage quotidien
- Logiciels MES
- Indicateurs de cadence
---
✅ **Actions correctives :**
- Réaliser un plan de capacité réaliste
- Équilibrer les lignes de production
- Définir des plans de contingence
---
📈 **Amélioration continue :**
- Suivi des écarts au quotidien
- Management visuel
- Animation courte quotidienne (TOP 5)
`,
};



export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Normaliser le message en minuscules pour mieux matcher les mots-clés
    let reply = "";

    if (message.toLowerCase().includes("bonjour")) {
      reply =
        "Bonjour 👋 ! Je suis ton assistant KPI industriel. Pose-moi une question sur les KPIs !";
    } else {
      // Recherche d'un KPI correspondant dans le message
      const kpiKey = Object.keys(kpiBank).find((kpi) =>
        message.toLowerCase().includes(kpi.toLowerCase())
      );

      if (kpiKey) {
        reply = kpiBank[kpiKey];
      } else {
        reply = `Merci pour ta question ! Je vais analyser ce KPI. Pour l’instant, je gère déjà plusieurs KPIs comme : taux de rebut, taux de production, etc. Pose-moi ta question.`;
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { reply: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
