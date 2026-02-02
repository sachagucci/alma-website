export type Language = 'fr' | 'en'

export const translations = {
    fr: {
        nav: {
            demo: "Réserver une démo",
            callUs: "Appelez-nous",
            banner: "Embauchez votre main-d'œuvre IA maintenant"
        },
        sectionLabels: {
            whyChooseUs: "Pourquoi nous choisir",
            ourProcess: "Notre processus"
        },
        hero: {
            title: "Conçu pour éliminer les no-shows avant qu'ils ne se produisent.",
            titlePrefix: "Conçu pour",
            titleHighlight: "éliminer les no-shows",
            titleSuffix: "avant qu'ils ne se produisent.",
            subtitle: "Alma est la main-d'œuvre IA pour la santé. Mia, notre réceptionniste IA, prédit quels patients ne se présenteront pas, les appelle de manière proactive pour confirmer, et remplit les annulations en quelques minutes, pendant que votre équipe se concentre sur le soin.",
            ctaPrimary: "Réserver une démo",
            ctaSecondary: "Parler à l'équipe",
            videoHint: "Voir Mia en action"
        },
        comparison: {
            title: "Opérations cliniques à l'ère de l'IA.",
            titlePrefix: "Opérations cliniques à",
            titleHighlight: "l'ère de l'IA",
            titleSuffix: ".",
            intro: "Alma est votre partenaire à long terme avec des possibilités infinies.",
            traditional: {
                title: "Réception Traditionnelle",
                items: [
                    { highlight: "Appels manqués:", text: "Ligne occupée pendant que des patients abandonnent" },
                    { highlight: "400 000 à 750 000", text: "rendez-vous perdus au Québec chaque année sans préavis" },
                    { highlight: "50%", text: "du temps de votre équipe administrative passé au téléphone" },
                    { highlight: "72%", text: "des médecins en épuisement professionnel à cause de la surcharge administrative" }
                ]
            },
            alma: {
                title: "Avec Alma",
                items: [
                    { highlight: "Zéro appel manqué:", text: "Disponible 24/7, appels simultanés illimités" },
                    { highlight: "40% moins d'absences:", text: "Rappels proactifs et confirmations intelligentes" },
                    { highlight: "Votre équipe libérée:", text: "Réservation instantanée, temps rendu aux tâches essentielles" },
                    { highlight: "Expérience patient exceptionnelle:", text: "Multilingue, naturelle, toujours disponible" }
                ]
            }
        },
        mia: {
            role: "Votre première collègue IA",
            headline: "Rencontrez Mia.",
            headlinePrefix: "Rencontrez",
            headlineHighlight: "Mia",
            activeLabel: "Actif",
            subheadline: "Mia ne se contente pas de répondre au téléphone. Elle pense, planifie et agit pour que chaque rendez-vous compte.",
            features: [
                {
                    title: "Toujours disponible, jamais débordée",
                    desc: "Répond à chaque appel en français ou en anglais sans temps d'attente. Gère un nombre illimité d'appels simultanés. Libère votre équipe administrative pour se concentrer sur les tâches à haute valeur qui nécessitent une touche humaine."
                },
                {
                    title: "Réduit les absences de 40%",
                    desc: "Identifie les patients à risque d'absence grâce à nos modèles ML propriétaires. Les appelle de manière proactive pour confirmer les rendez-vous. Remplit automatiquement les plages libérées en contactant votre liste d'attente."
                },
                {
                    title: "S'intègre à vos systèmes actuels",
                    desc: "Synchronisation directe avec votre DME. Réserve, modifie ou annule des rendez-vous en temps réel. Aucune perturbation du flux de travail—juste une amélioration transparente."
                },
                {
                    title: "Optimise votre horaire intelligemment",
                    desc: "Modèle d'optimisation des ressources propriétaire qui calcule les plages horaires les plus efficaces. Regroupe les procédures similaires, tient compte de la disponibilité de l'équipement et du personnel. Maximise la capacité de votre établissement."
                },
                {
                    title: "Sécurité et conformité avant tout",
                    desc: "Protection des données patients avec hébergement canadien. Conformité totale aux réglementations de santé québécoises et canadiennes. Toutes les interactions sont auditables et contrôlables."
                },
                {
                    title: "Escalade intelligente quand nécessaire",
                    desc: "Détecte les urgences et dirige les patients vers le 911 si nécessaire. Fait remonter les situations complexes au personnel humain. Assure la sécurité tout en gérant les tâches routinières de manière autonome."
                }
            ]
        },
        thousandReceptionists: {
            title: "Mille réceptionnistes, dans votre poche.",
            titlePrefix: "",
            titleHighlight: "Mille réceptionnistes",
            titleSuffix: ", dans votre poche.",
            subtitle: "En quelques minutes, déployez toute une équipe de réceptionnistes IA pour gérer votre clinique 24/7.",
            steps: [
                {
                    number: "01",
                    label: "Prédire",
                    title: "Analyse Prédictive",
                    description: "Mia analyse vos rendez-vous à venir via l'apprentissage automatique pour identifier les patients à risque de no-show, basé sur les historiques et signaux comportementaux."
                },
                {
                    number: "02",
                    label: "Appeler",
                    title: "Appels Proactifs",
                    description: "Notre système IA appelle des milliers de patients simultanément pour confirmer les rendez-vous, quelque chose qui prendrait des jours à une équipe de réception."
                },
                {
                    number: "03",
                    label: "Remplir",
                    title: "Remplissage Instantané",
                    description: "Quand une annulation survient, Mia contacte immédiatement votre liste d'attente et remplit le créneau en minutes—pas en heures ou en jours."
                },
                {
                    number: "04",
                    label: "Réception",
                    title: "Réception Automatisée",
                    description: "En parallèle, Mia répond à tous les appels entrants. Nouveaux rendez-vous, modifications, questions fréquentes. Votre équipe peut respirer."
                }
            ]
        },
        howItWorks: {
            title: "Comment ça fonctionne?",
            steps: [
                { time: "10h30", title: "Analyse prédictive", desc: "Mia analyse vos rendez-vous des 7 prochains jours. Elle identifie les patients à risque d'absence avec son modèle prédictif." },
                { time: "11h30", title: "Appels proactifs", desc: "Elle appelle tous les patients à risque. Simultanément. Confirme leur présence, répond à leurs questions." },
                { time: "11h45", title: "Remplissage intelligent", desc: "Un patient annule? Mia contacte immédiatement votre liste d'attente. La plage est remplie en minutes, pas en jours." },
                { time: "24/7", title: "Réception automatisée", desc: "En parallèle, Mia répond à tous les appels entrants. Nouveaux rendez-vous, modifications, questions fréquentes. Votre équipe peut respirer." }
            ]
        },
        impact: {
            title: "L'impact en chiffres.",
            asterisk: "* Chiffres potentiels basés sur nos projections",
            stats: [
                { value: "720K à 1,3M", label: "de rendez-vous récupérés chaque année si déployé à l'échelle du Canada" },
                { value: "500K à 1M", label: "de Canadiens qui pourraient accéder aux soins en temps voulu" },
                { value: "50%", label: "du temps administratif rendu à votre équipe pour les tâches à haute valeur" }
            ]
        },
        mission: {
            title: "Portés par le",
            titleCare: "soin.",
            foundersLabel: "Les Fondateurs",
            sachaName: "Sacha Gucciardo",
            matheoName: "Mathéo Vaulet",
            quote: "« Début 2025, j'ai vécu une urgence médicale majeure. C'était la première fois que j'étais confronté au système de santé canadien, et c'était effrayant. Ce jour-là, j'ai décidé que je voulais avoir un impact significatif. J'ai réalisé que même une amélioration de 1% du système de santé pourrait sauver des milliers de vies.\n\nLe système est surchargé. Pas par manque de dévouement, mais par un fardeau administratif écrasant. 72% des médecins sont en épuisement professionnel. Ils passent 25% de leur temps—une journée complète par semaine—loin des patients.\n\nNous ne pouvons pas former 64 000 nouveaux travailleurs de la santé du jour au lendemain. Mais nous pouvons rendre du temps à ceux qui sont déjà là. »",
            attribution: "— Sacha Gucciardo, co-fondateur"
        },
        urgentProblem: {
            title: "Nous commençons par le problème le plus urgent: remplir les sièges vides.",
            content: "Les rendez-vous manqués sans préavis sont un fléau invisible. 7,8% au Québec. Des centaines de milliers de patients qui auraient pu être vus, mais qui ne l'ont pas été. Pendant que d'autres attendent des mois.",
            solution: "Alma résout ce problème. Maintenant. Aujourd'hui.",
            future: "Et c'est juste le début. Nous construisons la main-d'œuvre IA pour automatiser toutes les tâches administratives répétitives qui surchargent nos premières lignes."
        },
        cta: {
            title: "Prêt à libérer votre équipe?",
            primary: "Embaucher Mia",
            secondary: "Parler à l'équipe"
        },
        footer: {
            tagline: "Alma — La main-d'œuvre IA pour la santé.",
            address: "Montréal, QC",
            email: "info@alma.quebec",
            copyright: "© 2026 Alma Technologies Inc."
        },
        contact: {
            title: "Parler à l'équipe",
            description: "Entrez votre courriel et nous vous contacterons.",
            placeholder: "votrenom@clinique.com",
            submit: "Envoyer",
            success: "Merci ! Nous vous contacterons sous peu."
        }
    },
    en: {
        nav: {
            demo: "Book a Demo",
            callUs: "Call Us",
            banner: "Hire your AI workforce now"
        },
        sectionLabels: {
            whyChooseUs: "Why choose us",
            ourProcess: "Our Process"
        },
        hero: {
            title: "Built to eliminate no-shows before they happen.",
            titlePrefix: "Built to",
            titleHighlight: "eliminate no-shows",
            titleSuffix: "before they happen.",
            subtitle: "Alma is the AI workforce for healthcare. Mia, our AI receptionist, predicts which patients won't show up, calls them proactively to confirm, and fills cancellations within minutes, while your team focuses on care.",
            ctaPrimary: "Book a Demo",
            ctaSecondary: "Talk to the Team",
            videoHint: "See Mia in Action"
        },
        comparison: {
            title: "Clinic operations in the AI Age.",
            titlePrefix: "Clinic operations in the",
            titleHighlight: "AI Age",
            titleSuffix: ".",
            intro: "Alma is your long term partner with infinite possibilities.",
            traditional: {
                title: "Traditional Reception",
                items: [
                    { highlight: "Missed calls:", text: "Busy line while patients give up" },
                    { highlight: "400,000 to 750,000", text: "appointments lost in Quebec each year without notice" },
                    { highlight: "50%", text: "of your admin team's time spent on the phone" },
                    { highlight: "72%", text: "of physicians experiencing burnout due to administrative overload" }
                ]
            },
            alma: {
                title: "With Alma",
                items: [
                    { highlight: "Zero missed calls:", text: "Available 24/7, unlimited simultaneous calls" },
                    { highlight: "40% fewer no-shows:", text: "Proactive reminders and smart confirmations" },
                    { highlight: "Your team freed:", text: "Instant booking, time returned to essential tasks" },
                    { highlight: "Exceptional patient experience:", text: "Multilingual, natural, always available" }
                ]
            }
        },
        mia: {
            role: "Your first AI colleague",
            headline: "Meet Mia.",
            headlinePrefix: "Meet",
            headlineHighlight: "Mia",
            activeLabel: "Active",
            subheadline: "Mia doesn't just answer the phone. She thinks, plans, and acts so every appointment counts.",
            features: [
                {
                    title: "Always Available, Never Overwhelmed",
                    desc: "Answers every call in English or French with zero wait time. Handles unlimited simultaneous calls. Frees your admin team to focus on high-value tasks that require the human touch."
                },
                {
                    title: "Reduces No-Shows by 40%",
                    desc: "Identifies at-risk patients using our proprietary ML models. Proactively calls to confirm appointments. Automatically fills freed slots by contacting your waitlist."
                },
                {
                    title: "Integrates with Your Current Systems",
                    desc: "Direct sync with your EMR. Books, modifies, or cancels appointments in real-time. No workflow disruption—just seamless enhancement."
                },
                {
                    title: "Optimizes Your Schedule Intelligently",
                    desc: "Proprietary resource optimization model calculates the most efficient appointment slots. Groups similar procedures, accounts for equipment and staff availability. Maximizes your facility's capacity."
                },
                {
                    title: "Security & Compliance First",
                    desc: "Patient data protection with Canadian hosting. Full compliance with Quebec and Canadian healthcare regulations. All interactions auditable and controllable."
                },
                {
                    title: "Smart Escalation When It Matters",
                    desc: "Detects emergencies and directs patients to 911 when needed. Escalates complex situations to human staff. Ensures safety while handling routine tasks autonomously."
                }
            ]
        },
        thousandReceptionists: {
            title: "A thousand receptionists, in your palm.",
            titlePrefix: "A",
            titleHighlight: "thousand receptionists",
            titleSuffix: ", in your palm.",
            subtitle: "Within minutes, deploy a whole team of AI receptionists to manage your clinic 24/7.",
            steps: [
                {
                    number: "01",
                    label: "Predict",
                    title: "Predictive Analysis",
                    description: "Mia analyzes your upcoming appointments using machine learning to identify patients at risk of no-show, based on historical patterns and behavior signals."
                },
                {
                    number: "02",
                    label: "Reach",
                    title: "Proactive Outreach",
                    description: "Our AI system calls thousands of patients simultaneously to confirm appointments, something that takes reception teams days to accomplish."
                },
                {
                    number: "03",
                    label: "Fill",
                    title: "Instant Backfill",
                    description: "When a cancellation occurs, Mia immediately contacts your waitlist and fills the slot within minutes—not hours or days."
                },
                {
                    number: "04",
                    label: "Reception",
                    title: "Automated Reception",
                    description: "In parallel, Mia answers all incoming calls. New appointments, modifications, FAQs. Your team can breathe."
                }
            ]
        },
        howItWorks: {
            title: "How does it work?",
            steps: [
                { time: "10:30 AM", title: "Predictive analysis", desc: "Mia analyzes your appointments for the next 7 days. She identifies at-risk patients with her predictive model." },
                { time: "11:30 AM", title: "Proactive calls", desc: "She calls all at-risk patients. Simultaneously. Confirms their attendance, answers their questions." },
                { time: "11:45 AM", title: "Smart backfill", desc: "A patient cancels? Mia immediately contacts your waitlist. The slot is filled in minutes, not days." },
                { time: "24/7", title: "Automated reception", desc: "In parallel, Mia answers all incoming calls. New appointments, modifications, FAQs. Your team can breathe." }
            ]
        },
        impact: {
            title: "The impact in numbers.",
            asterisk: "* Potential figures based on our projections",
            stats: [
                { value: "720K to 1.3M", label: "appointments recovered each year if deployed across Canada" },
                { value: "500K to 1M", label: "Canadians who could access care in a timely manner" },
                { value: "50%", label: "of administrative time returned to your team for high-value tasks" }
            ]
        },
        mission: {
            title: "Driven by",
            titleCare: "care.",
            foundersLabel: "Founders",
            sachaName: "Sacha Gucciardo",
            matheoName: "Mathéo Vaulet",
            quote: "\"In early 2025, I experienced a major health scare. It was the first time I was confronted with the Canadian healthcare system, and it was scary. That day, I decided I wanted to make a meaningful impact. I realized that even a 1% improvement to the healthcare system could save thousands of lives.\n\nThe system is overloaded. Not from lack of dedication, but from an overwhelming administrative burden. 72% of physicians are burnt out. They spend 25% of their time—a full day every week—away from patients.\n\nWe can't train 64,000 new healthcare workers overnight. But we can support our frontline in unprecedented ways. By using cutting-edge technology like Alma to prevent burnout and keep our doctors healthy, we can keep Canadians healthy.\"",
            attribution: "— Sacha Gucciardo, Co-founder"
        },
        urgentProblem: {
            title: "We start with the most urgent problem: filling empty seats.",
            content: "Missed appointments without notice are an invisible plague. 7.8% in Quebec. Hundreds of thousands of patients who could have been seen, but weren't. While others wait for months.",
            solution: "Alma solves this problem. Now. Today.",
            future: "And this is just the beginning. We're building the AI workforce to automate all the repetitive administrative tasks that overburden our front lines."
        },
        cta: {
            title: "Ready to free your team?",
            primary: "Hire Mia",
            secondary: "Talk to the Team"
        },
        footer: {
            tagline: "Alma — The AI workforce for healthcare.",
            address: "Montreal, QC",
            email: "info@alma.quebec",
            copyright: "© 2026 Alma Technologies Inc."
        },
        contact: {
            title: "Talk to the Team",
            description: "Enter your email and we'll get in touch.",
            placeholder: "yourname@clinic.com",
            submit: "Send",
            success: "Thank you! We'll be in touch shortly."
        }
    }
}

export function getTranslation(lang: Language) {
    return translations[lang]
}
