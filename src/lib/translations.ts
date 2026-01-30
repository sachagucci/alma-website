export type Language = 'fr' | 'en'

export const translations = {
    fr: {
        nav: {
            signIn: "Se connecter",
            demo: "Parler à Sacha",
            callUs: "Appelez-nous",
            overview: "Vue d'ensemble",
            callLog: "Journal d'appels",
            // Mia
            mia: "Mia",
            missionControl: "Mission Control",
            journalLog: "Journal de bord",
            clients: "Clients",
            // Leo
            leo: "Leo",
            chat: "Demander à Leo",
            // Eva
            eva: "Eva",
            invoices: "Factures",
            analytics: "Analytique",
            reports: "Rapports",
            // System
            settings: "Paramètres",
            signOut: "Se déconnecter"
        },
        hero: {
            badge: "#1 Réceptionniste IA au Québec",
            tagline: "La main-d'œuvre IA",
            tagline2: "pour la santé.",
            tagline3: "Nous gérons le reste.",
            subheadline: "Rendre le système de santé accessible aux millions de Canadiens qui peinent à y accéder, en automatisant les tâches administratives qui surchargent nos premières lignes.",
            videoHint: "Voir Mia en action",
            videoTitle: "Démo Alma",
            videoThumbnailAlt: "Vignette vidéo",
            ctaPrimary: "Voir la démo",
            ctaSecondary: "Parler à Sacha"
        },
        comparison: {
            title: "Pourquoi Alma?",
            traditional: {
                title: "Réception Traditionnelle",
                items: [
                    "Appels manqués, ligne occupée ou équipe débordée",
                    "Absences qui impactent la rentabilité",
                    "Des heures au téléphone, loin des tâches essentielles",
                    "Roulement coûteux et formation constante"
                ]
            },
            alma: {
                title: "Avec Alma",
                items: [
                    "Disponible 24/7, appels simultanés illimités",
                    "40% moins d'absences, plus de revenus",
                    "Réservation instantanée, équipe libérée",
                    "Multilingue, expérience patient exceptionnelle"
                ]
            }
        },
        stats: {
            canadians: { value: "6,5M", label: "Canadiens sans médecin de famille" },
            reduction: { value: "40%", label: "Réduction des absences" },
            availability: { value: "24/7", label: "Toujours disponible" },
            appointments: { value: "720K", label: "Rendez-vous récupérés/an" }
        },
        mission: {
            title: "Notre Histoire",
            foundersLabel: "Les Fondateurs",
            foundersHeadline: "Rencontrez les fondateurs",
            founders: "Mathéo et Sacha",
            healthScare: "Début 2025, j'ai vécu une urgence médicale majeure. C'était la première fois que j'étais confronté au système de santé, et c'était effrayant. Ce jour-là, j'ai décidé que je voulais avoir un impact significatif. Ces événements nous forcent à nous poser des questions plus profondes. J'ai réalisé que même une amélioration de 1% du système de santé pourrait sauver des milliers de vies.",
            storyIntro: "Le système de santé actuel est surchargé par les tâches administratives, laissant nos médecins en épuisement professionnel. Chez Alma, nous croyons que la santé est la priorité absolue d'un pays. Une population en santé est une population prospère. Mais pour être en santé, nous avons besoin que nos médecins le soient aussi. En ce moment, le fardeau administratif les épuise, s'ajoutant à la pénurie de médecins et aux listes d'attente croissantes en médecine familiale. Nous savions qu'il fallait agir.",
            stats: {
                crisis: {
                    highlight: "72 %",
                    text: "Des médecins sont en épuisement professionnel. La cause principale ? La surcharge administrative."
                },
                burnout: {
                    highlight: "25 %",
                    text: "C'est une journée complète par semaine passée loin des patients à remplir des formulaires. Un gaspillage que le système ne peut plus se permettre."
                }
            },
            conclusion: "*Alma rend ce temps aux médecins.*",
            description: "Nous supprimons la charge mentale administrative pour qu'ils se concentrent sur l'essentiel : prendre soin de leurs patients.",
            // Legacy/Unused keys can be cleaned up or kept if likely to be reused, but for minimalist design we focus on the above.
            productIntro: "C'est pourquoi nous avons créé Mia.",
            productDesc: "Mia est une réceptionniste virtuelle qui gère tous vos appels.",
            prediction: "Elle réduit considérablement les absences.",
            philosophy: "Simple. Humain. Efficace."
        },
        mia: {
            role: "Votre réceptionniste IA autonome",
            headline: "Rencontrez Mia.",
            subheadline: "L'IA qui répond à vos appels, réduit les absences et libère votre équipe.",
            features: [
                {
                    title: "Disponible 24/7",
                    desc: "Mia répond à chaque appel, en français ou en anglais, sans temps d'attente. Appels simultanés illimités."
                },
                {
                    title: "Réduit les absences de 40%",
                    desc: "Appels de rappel proactifs et confirmations automatiques pour que chaque rendez-vous soit honoré."
                },
                {
                    title: "Réservation instantanée",
                    desc: "Synchronisation directe avec votre DME pour réserver, modifier ou annuler en temps réel."
                }
            ],
            security: {
                title: "Sécurité et Conformité",
                desc: "Protection des données patients, hébergement au Canada, conformité aux normes de santé."
            }
        },
        features: {
            voice: {
                title: "Voix Réelle",
                desc: "Nous répondons à vos appels, planifions les rendez‑vous et gérons l'accueil des patients. Comme une vraie réception, sans les congés."
            },
            compliance: {
                title: "Confidentialité & conformité",
                desc: "Protection des données patients, hébergement sécurisé et conformité aux exigences locales en santé."
            },
            freedom: {
                title: "Plus de temps pour soigner",
                desc: "Nous rapportons du temps à vos équipes cliniques pour qu'elles se concentrent sur les patients."
            }
        },
        contact: {
            title: "Parler à Sacha",
            description: "Entrez votre courriel et nous vous contacterons.",
            placeholder: "votrenom@clinique.com",
            submit: "Envoyer",
            success: "Merci ! Nous vous contacterons sous peu."
        },
        cta: {
            title: "Prêt à simplifier votre clinique?"
        },
        footer: {
            tagline: "Le soin d'abord.",
            address: "Montréal, QC",
            email: "info@alma.quebec",
            copyright: "© 2026 Alma Technologies Inc."
        },
        login: {
            title: "Connexion",
            subtitle: "Accédez à votre tableau de bord",
            emailLabel: "Courriel",
            passwordLabel: "Mot de passe",
            emailPlaceholder: "nom@exemple.com",
            passwordPlaceholder: "••••••••",
            submit: "Se connecter",
            loading: "Connexion...",
            noAccount: "Pas de compte ?",
            signUp: "S'inscrire",
            error: "Une erreur est survenue",
            heroTitle: "Alma",
            heroSubtitle: "Votre réceptionniste IA intelligente.",
            heroQuote: "\"Le soin d'abord.\""
        },
        onboarding: {
            welcome: {
                title: "Bienvenue chez Alma",
                subtitle: "Configurez votre réceptionniste IA intelligent."
            },
            steps: {
                1: "Infos Perso",
                2: "Votre Entreprise",
                3: "Configuration Agent"
            },
            step1: {
                title: "Créer votre compte",
                subtitle: "Commençons par vos informations personnelles",
                firstName: "Prénom",
                lastName: "Nom",
                email: "Courriel",
                password: "Mot de passe",
                phone: "Numéro de téléphone",
                submit: "Continuer",
                alreadyAccount: "Déjà un compte ?",
                signIn: "Se connecter"
            },
            step2: {
                title: "À propos de votre entreprise",
                subtitle: "Aidez-nous à adapter Alma à vos besoins",
                companyName: "Nom de l'entreprise",
                serviceType: "Type de service",
                companySize: "Taille de l'entreprise",
                regions: "Régions desservies",
                regionsPlaceholder: "ex: Montréal, Québec...",
                description: "Parlez-nous de votre entreprise",
                descriptionPlaceholder: "Quels services offrez-vous ?",
                docsLabel: "Documents d'entreprise (Optionnel)",
                docsHint: "Téléversez brochures ou guides",
                dragDrop: "Glisser-déposer PDF ou images",
                browse: "ou cliquer pour parcourir",
                back: "Retour",
                continue: "Continuer"
            },
            step3: {
                title: "Personnalisez votre IA",
                subtitle: "Choisissez comment votre réceptionniste doit interagir",
                prefLang: "Langue de réponse préférée",
                personality: "Personnalité de l'agent",
                complete: "Terminer la configuration",
                processing: "Traitement..."
            }
        },
        chat: {
            newChat: "Nouvelle discussion",
            leo: "Leo",
            chatMode: "Discuter",
            invoiceMode: "Facturation",
            startConversation: "Lancer une discussion",
            processInvoice: "Traiter une facture",
            invoiceHint: "Téléversez ou prenez une photo d'une facture. Vérifiez les données avant de sauvegarder.",
            chatHint: "Demandez-moi n'importe quoi sur ",
            invoicePlaceholder: "Poser une question sur vos factures...",
            chatPlaceholder: "Écrivez votre message...",
            send: "Envoyer",
            uploadFile: "Téléverser un fichier",
            takePhoto: "Prendre une photo",
            noRecentChats: "Aucune discussion récente"
        },
        settings: {
            title: "Paramètres",
            subtitle: "Configurez votre réceptionniste Mia",
            back: "Retour au tableau de bord",
            tabs: {
                agent: "Configuration de Mia",
                knowledge: "Connaissance de l'entreprise"
            },
            agent: {
                name: "Comment voulez-vous que Mia s'appelle ?",
                namePlaceholder: "Par défaut : ",
                nameHint: "C'est le nom qu'elle utilisera pour se présenter au téléphone.",
                language: "Langue",
                personality: "Personnalité",
                personalities: {
                    professional: { title: "Professionnel", desc: "Formel et précis" },
                    friendly: { title: "Amical", desc: "Chaleureux et accessible" },
                    empathetic: { title: "Empathique", desc: "Attentionné et solidaire" }
                },
                save: "Sauvegarder les changements",
                saving: "Sauvegarde..."
            },
            knowledge: {
                companyInfo: "Information de l'entreprise",
                businessName: "Nom de l'entreprise",
                serviceType: "Type de service",
                companySize: "Taille de l'entreprise",
                description: "Description",
                descriptionPlaceholder: "Brève description de votre entreprise...",
                saveCompany: "Sauvegarder l'info",
                uploadTitle: "Téléverser un nouveau document",
                clickToSelect: "Cliquer pour sélectionner PDF ou images",
                readyToUpload: "Fichiers prêts à être téléversés :",
                uploadProcess: "Téléverser et traiter",
                trustedSources: "Sources de confiance",
                trustedSourcesDesc: "Ajoutez des URL que vous jugez fiables.",
                addSource: "Ajouter",
                noSources: "Aucune source ajoutée",
                documents: "Documents de la base de connaissances",
                noDocs: "Aucun document téléversé"
            },
            messages: {
                configSaved: "Configuration sauvegardée avec succès !",
                configError: "Échec de la sauvegarde",
                companySaved: "Info de l'entreprise mise à jour !",
                companyError: "Échec de la mise à jour",
                docUploaded: "document(s) téléversé(s) et traité(s) !",
                docDeleted: "Document supprimé",
                docError: "Échec de la suppression",
                sourceAdded: "Source ajoutée !",
                sourceError: "Échec de l'ajout",
                sourceRemoved: "Source supprimée",
                validUrl: "Veuillez entrer une URL valide"
            }
        },
        invoices: {
            title: "Analytique des Factures",
            subtitle: "Suivez vos revenus et dépenses",
            totalRevenue: "Revenus Totaux",
            revenue: "Revenus",
            totalInvoices: "Nombre de Factures",
            expensesByCategory: "Dépenses par Catégorie",
            noExpenses: "Aucune dépense pour le moment",
            noInvoices: "Aucune facture. Téléversez-en une dans le Chat !",
            unknownVendor: "Fournisseur Inconnu",
            other: "Autre",
            outstandingInvoices: "Factures Impayées",
            expenses: "Dépenses",
            recentInvoices: "Factures Récentes",
            status: {
                paid: "Paid",
                pending: "Pending",
                overdue: "Overdue",
                draft: "Draft"
            },
            table: {
                invoice: "Facture",
                client: "Client",
                amount: "Montant",
                status: "Statut",
                date: "Date"
            }
        },
        dashboard: {
            title: "Mission Control",
            subtitle: "Cockpit de performance clinique",
            stats: {
                calls: "Appels Traités",
                sms: "Total SMS",
                activeThreads: "Discussions Actives",
                efficiency: "Efficacité IA" // or "Temps de parole IA"
            },
            productivity: {
                title: "Carte de Productivité",
                funnel: "Entonnoir de Conversion",
                bookingRate: "Taux de Réservation"
            },
            activity: {
                title: "Activité Récente",
                allClear: "Rien à signaler.",
                newClient: "Nouveau client",
                callProcessed: "Appel traité",
                invoicePaid: "Facture payée",
                justNow: "À l'instant",
                ago: "il y a"
            },
            quickActions: {
                title: "Centre d'Action",
                newInvoice: "Nouvelle Facture",
                addClient: "Ajouter Client",
                team: "Gérer l'équipe"
            },
            loading: "Chargement du tableau de bord...",
            auth: {
                required: "Authentification Requise",
                redirecting: "Redirection vers la connexion..."
            }
        }
    },
    en: {
        nav: {
            signIn: "Sign In",
            demo: "Talk to Sacha",
            callUs: "Call us directly",
            overview: "Overview",
            callLog: "Call Log",
            clients: "Clients",
            analytics: "Analytics",
            reports: "Reports",
            chat: "Chat",
            invoices: "Invoices",
            settings: "Settings",
            signOut: "Sign Out",
            // Mia
            mia: "Mia",
            missionControl: "Mission Control",
            journalLog: "Call Log",
        },
        hero: {
            badge: "#1 AI Receptionist in Quebec",
            tagline: "The AI workforce",
            tagline2: "for healthcare.",
            tagline3: "We handle the rest.",
            subheadline: "Making healthcare accessible to the millions of Canadians struggling to access it by automating the admin tasks burdening our front lines.",
            videoHint: "See Mia in Action",
            videoTitle: "Alma Demo",
            videoThumbnailAlt: "Video Thumbnail",
            ctaPrimary: "See the Demo",
            ctaSecondary: "Talk to Sacha"
        },
        comparison: {
            title: "Why Alma?",
            traditional: {
                title: "Traditional Reception",
                items: [
                    "Missed calls, busy lines or overwhelmed staff",
                    "No-shows hurting profitability",
                    "Hours on the phone, away from high-value tasks",
                    "Costly turnover and constant training"
                ]
            },
            alma: {
                title: "With Alma",
                items: [
                    "Available 24/7, unlimited simultaneous calls",
                    "40% fewer no-shows, more revenue",
                    "Instant booking, team freed up",
                    "Multilingual, exceptional patient experience"
                ]
            }
        },
        stats: {
            canadians: { value: "6.5M", label: "Canadians without a family doctor" },
            reduction: { value: "40%", label: "Reduction in no-shows" },
            availability: { value: "24/7", label: "Always available" },
            appointments: { value: "720K", label: "Appointments recovered yearly" }
        },
        mission: {
            title: "Our Story",
            foundersLabel: "Founders",
            foundersHeadline: "Meet the founders",
            founders: "Mathéo and Sacha",
            healthScare: "In early 2025, I experienced a major health scare. It was the first time I was confronted with the healthcare system, and it was scary. That day, I decided I wanted to make a meaningful impact. These kinds of events force you to ask deeper questions. I realized that even a 1% improvement to the healthcare system could save thousands of lives.",
            storyIntro: "The current healthcare system is overburdened by administrative tasks, leaving our doctors burnt out. At Alma, we believe health is the top priority in a country. A healthy population is a wealthy population. But to be healthy, we need our doctors to be healthy. Right now, admin burden is causing them to burn out on top of the doctor shortages we have and the growing waitlist for family medicine. We knew something had to be done.",
            stats: {
                crisis: {
                    highlight: "72%",
                    text: "Of physicians are experiencing burnout. The main driver? Administrative overload."
                },
                burnout: {
                    highlight: "25%",
                    text: "That’s one full day every week spent away from patients, filling out forms. A waste the system can no longer afford."
                }
            },
            conclusion: "*Alma gives that time back.*",
            description: "We strip away the administrative mental load so doctors can focus on what matters: taking care of their patients. ",
            productIntro: "That's why we created Mia.",
            productDesc: "Mia is a virtual receptionist that takes care of all your calls.",
            prediction: "She significantly reduces no-shows.",
            philosophy: "Simple. Human. Effective."
        },
        mia: {
            role: "Your autonomous AI receptionist",
            headline: "Meet Mia.",
            subheadline: "The AI that answers your calls, reduces no-shows, and frees your team.",
            features: [
                {
                    title: "Available 24/7",
                    desc: "Mia answers every call, in English or French, with zero wait time. Unlimited simultaneous calls."
                },
                {
                    title: "40% Fewer No-Shows",
                    desc: "Proactive reminder calls and automatic confirmations ensure every appointment is honored."
                },
                {
                    title: "Instant Booking",
                    desc: "Direct sync with your EMR to book, reschedule, or cancel in real-time."
                }
            ],
            security: {
                title: "Security & Compliance",
                desc: "Patient data protection, Canadian hosting, healthcare compliance."
            }
        },
        features: {
            voice: {
                title: "Real Voice",
                desc: "We answer your calls, manage appointments and intake. Like a real receptionist, without the time off."
            },
            compliance: {
                title: "Privacy & Compliance",
                desc: "Patient privacy, secure hosting, and local healthcare data compliance."
            },
            freedom: {
                title: "More Time for Patients",
                desc: "We give clinical teams back their time so they can focus on patient care."
            }
        },
        contact: {
            title: "Talk to Sacha",
            description: "Enter your email and we'll reach out.",
            placeholder: "yourname@clinic.com",
            submit: "Send",
            success: "Thanks! We'll be in touch."
        },
        cta: {
            title: "Ready to simplify your clinic?"
        },
        footer: {
            tagline: "Care First.",
            address: "Montreal, QC",
            email: "info@alma.quebec",
            copyright: "© 2026 Alma Technologies Inc."
        },
        login: {
            title: "Sign In",
            subtitle: "Access your dashboard",
            emailLabel: "Email address",
            passwordLabel: "Password",
            emailPlaceholder: "name@example.com",
            passwordPlaceholder: "••••••••",
            submit: "Sign In",
            loading: "Signing in...",
            noAccount: "Don't have an account?",
            signUp: "Sign up",
            error: "An error occurred",
            heroTitle: "Alma",
            heroSubtitle: "Your intelligent AI receptionist.",
            heroQuote: "\"Care first.\""
        },
        onboarding: {
            welcome: {
                title: "Welcome to Alma",
                subtitle: "Set up your intelligent AI receptionist."
            },
            steps: {
                1: "Personal Info",
                2: "Your Business",
                3: "Agent Setup"
            },
            step1: {
                title: "Create your account",
                subtitle: "Let's start with your personal information",
                firstName: "First Name",
                lastName: "Last Name",
                email: "Email Address",
                password: "Password",
                phone: "Phone Number",
                submit: "Continue",
                alreadyAccount: "Already have an account?",
                signIn: "Sign in"
            },
            step2: {
                title: "About your business",
                subtitle: "Help us tailor Alma for your needs",
                companyName: "Company Name",
                serviceType: "Service Type",
                companySize: "Company Size",
                regions: "Regions Served",
                regionsPlaceholder: "e.g., Montreal",
                description: "Tell us more about your business",
                descriptionPlaceholder: "What services do you offer?",
                docsLabel: "Company Documents (Optional)",
                docsHint: "Upload brochures or guides",
                dragDrop: "Drag & drop PDF or images",
                browse: "or click to browse",
                back: "Back",
                continue: "Continue"
            },
            step3: {
                title: "Customize your AI",
                subtitle: "Choose how your receptionist should interact",
                prefLang: "Preferred Language",
                personality: "Agent Personality",
                complete: "Complete Setup",
                processing: "Processing..."
            }
        },
        chat: {
            newChat: "New Chat",
            leo: "Leo",
            chatMode: "Chat",
            invoiceMode: "Process Invoice",
            startConversation: "Start a conversation",
            processInvoice: "Process an Invoice",
            invoiceHint: "Upload or take a photo of an invoice. Review the data before saving.",
            chatHint: "Ask me anything about ",
            invoicePlaceholder: "Ask about your invoices...",
            chatPlaceholder: "Type your message...",
            send: "Send",
            uploadFile: "Upload file",
            takePhoto: "Take photo",
            noRecentChats: "No recent chats"
        },
        settings: {
            title: "Settings",
            subtitle: "Configure your receptionist Mia",
            back: "Back to Dashboard",
            tabs: {
                agent: "Configure Mia",
                knowledge: "Company Knowledge"
            },
            agent: {
                name: "What should Mia call herself?",
                namePlaceholder: "Default: ",
                nameHint: "This is the name she will use to introduce herself on the phone.",
                language: "Language",
                personality: "Personality",
                personalities: {
                    professional: { title: "Professional", desc: "Formal and precise" },
                    friendly: { title: "Friendly", desc: "Warm and approachable" },
                    empathetic: { title: "Empathetic", desc: "Caring and supportive" }
                },
                save: "Save Changes",
                saving: "Saving..."
            },
            knowledge: {
                companyInfo: "Company Information",
                businessName: "Business Name",
                serviceType: "Service Type",
                companySize: "Company Size",
                description: "Description",
                descriptionPlaceholder: "Brief description of your business...",
                saveCompany: "Save Company Info",
                uploadTitle: "Upload New Document",
                clickToSelect: "Click to select PDF or images",
                readyToUpload: "Files ready to upload:",
                uploadProcess: "Upload & Process",
                trustedSources: "Trusted Sources",
                trustedSourcesDesc: "Add URLs that you trust as reference sources.",
                addSource: "Add",
                noSources: "No trusted sources added yet",
                documents: "Knowledge Base Documents",
                noDocs: "No documents uploaded yet"
            },
            messages: {
                configSaved: "Configuration saved successfully!",
                configError: "Failed to save",
                companySaved: "Company info updated successfully!",
                companyError: "Failed to update",
                docUploaded: "document(s) uploaded and processed!",
                docDeleted: "Document deleted",
                docError: "Delete failed",
                sourceAdded: "Source added!",
                sourceError: "Failed to add",
                sourceRemoved: "Source removed",
                validUrl: "Please enter a valid URL"
            }
        },
        invoices: {
            title: "Invoice Analytics",
            subtitle: "Track your revenue and expenses",
            totalRevenue: "Total Revenue",
            revenue: "Revenue",
            totalInvoices: "Total Invoices",
            expensesByCategory: "Expenses by Category",
            noExpenses: "No expense data yet",
            noInvoices: "No invoices yet.",
            unknownVendor: "Unknown Vendor",
            other: "Other",
            outstandingInvoices: "Outstanding Invoices",
            expenses: "Expenses",
            recentInvoices: "Recent Invoices",
            status: {
                paid: "Paid",
                pending: "Pending",
                overdue: "Overdue",
                draft: "Draft"
            },
            table: {
                invoice: "Invoice",
                client: "Client",
                amount: "Amount",
                status: "Status",
                date: "Date"
            }
        },
        dashboard: {
            title: "Mission Control",
            subtitle: "Live clinic performance cockpit",
            stats: {
                calls: "Total Calls",
                sms: "Total SMS",
                activeThreads: "Active Threads",
                efficiency: "AI Talk Time"
            },
            productivity: {
                title: "Productivity Map",
                funnel: "Conversion Funnel",
                bookingRate: "Booking Rate"
            },
            activity: {
                title: "Recent Activity",
                allClear: "All clear.",
                newClient: "New client",
                callProcessed: "Call processed",
                invoicePaid: "Invoice paid",
                justNow: "Just now",
                ago: "ago"
            },
            quickActions: {
                title: "Action Center",
                newInvoice: "New Invoice",
                addClient: "Add Client",
                team: "Manage Team"
            },
            loading: "Loading Dashboard...",
            auth: {
                required: "Authentication Required",
                redirecting: "Redirecting you to login..."
            }
        }
    }
}
