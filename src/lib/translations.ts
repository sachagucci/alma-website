export type Language = 'fr' | 'en'

export const translations = {
    fr: {
        nav: {
            signIn: "Se connecter",
            demo: "Parler à un humain",
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
            tagline: "Simplifiez-vous la vie.",
            tagline2: "Concentrez-vous sur votre travail.",
            tagline3: "On s'occupe du reste.",
            subheadline: "Votre talent est sur le chantier, pas derrière un écran ou un téléphone. Alma gère vos appels et votre agenda pour que vous ne manquiez plus jamais un contrat.",
            videoHint: "Rencontrez l'équipe Alma",
            ctaPrimary: "Parler à un humain",
            ctaSecondary: "S'inscrire"
        },
        local: {
            title: "L'humain d'abord",
            subtitle: "On ne remplace personne. On vous libère.",
            description: "Alma n'est pas là pour remplacer les humains. On est là pour vous libérer de la paperasse, des appels manqués et de l'admin qui vous empêche de faire ce que vous aimez. Vous êtes l'expert. Alma, c'est juste votre bras droit."
        },
        agents: {
            sectionTitle: "Rencontrez vos nouveaux collègues",
            mia: {
                name: "Mia",
                title: "Votre réceptionniste",
                subtitle: "On jurerait parler à une vraie personne. Mais en plus efficace.",
                points: [
                    "Disponible 24/7 par appel et texto",
                    "Représentation uniforme de votre marque",
                    "Opérationnelle en moins d'une journée, sans formation",
                    "Suivi automatique pour une satisfaction client maximale"
                ]
            },
            leo: {
                name: "Léo",
                title: "Votre assistant personnel",
                subtitle: "Posez n'importe quelle question sur votre entreprise.",
                points: [
                    "Connaît tout sur votre entreprise",
                    "Questions sur vos factures, clients, revenus",
                    "Conseils pour optimiser vos opérations",
                    "Toujours disponible, jamais dans le néant"
                ]
            },
            eva: {
                name: "Eva",
                title: "Votre vue d'ensemble",
                subtitle: "Prenez des décisions éclairées. Facturez en 30 secondes.",
                points: [
                    "Connectée à QuickBooks et vos outils",
                    "Créez des factures en 30 secondes",
                    "Fini la paperasse manuelle",
                    "Envoi automatique aux clients"
                ]
            }
        },
        features: {
            voice: {
                title: "Voix Réelle",
                desc: "On répond à vos appels et on gère les rendez-vous. Comme une vraie personne, mais sans les vacances."
            },
            compliance: {
                title: "Conformité",
                desc: "Loi 25, hébergement local, données au Québec. Pas de maux de tête."
            },
            freedom: {
                title: "Liberté",
                desc: "On est là pour vous redonner le contrôle de votre temps. Faites ce que vous aimez, on gère le reste."
            }
        },
        proof: {
            title: "Compatible avec vos outils"
        },
        contact: {
            title: "Parler à un humain",
            description: "Entrez votre courriel et on vous rappelle.",
            placeholder: "votrenom@entreprise.com",
            submit: "Envoyer",
            success: "Merci ! On vous revient sous peu."
        },
        cta: {
            title: "Prêt à vous simplifier la vie?"
        },
        footer: {
            tagline: "Votre secrétariat IA",
            address: "1475 Rue Peel, Bureau 200, Montréal, QC H3A 1T1",
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
            heroSubtitle: "Votre réceptionniste IA intelligente pour l'entreprise de service moderne.",
            heroQuote: "\"La façon la plus efficace de gérer les communications clients. Simple, puissant et invisible.\""
        },
        onboarding: {
            welcome: {
                title: "Bienvenue chez Alma",
                subtitle: "Configurez votre réceptionniste IA intelligent en quelques étapes."
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
                regionsPlaceholder: "ex: Montréal, Québec, Laval...",
                description: "Parlez-nous de votre entreprise",
                descriptionPlaceholder: "Quels services offrez-vous ? Qui sont vos clients ?",
                docsLabel: "Documents d'entreprise (Optionnel)",
                docsHint: "Téléversez brochures ou guides de service",
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
            subtitle: "Configurez votre réceptionniste Mia et gérez vos connaissances",
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
                trustedSourcesDesc: "Ajoutez des URL que vous jugez fiables. L'assistant pourra les utiliser pour fournir des réponses plus précises.",
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
                paid: "Payée",
                pending: "En attente",
                overdue: "En retard",
                draft: "Brouillon"
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
            subtitle: "Cockpit de performance clinique en temps réel",
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
            demo: "Talk to a Human",
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
            // Leo
            leo: "Leo",
            // Eva
            eva: "Eva",
        },
        hero: {
            tagline: "Simplify your life.",
            tagline2: "Focus on your work.",
            tagline3: "We handle the rest.",
            subheadline: "Your talent is on the job site, not behind a screen or a phone. Alma handles your calls and schedule so you never miss a contract.",
            videoHint: "Meet the Alma Team",
            ctaPrimary: "Talk to a Human",
            ctaSecondary: "Sign Up"
        },
        local: {
            title: "Humans First",
            subtitle: "We don't replace people. We free them.",
            description: "Alma isn't here to replace humans. We're here to free you from paperwork, missed calls, and the admin that keeps you from doing what you love. You're the expert. Alma is just your right hand."
        },
        agents: {
            sectionTitle: "Meet Your New Colleagues",
            mia: {
                name: "Mia",
                title: "Your Receptionist",
                subtitle: "Sounds exactly like a real person. But more efficient.",
                points: [
                    "Available 24/7 via call and text",
                    "Consistent brand representation",
                    "Operational in less than a day, no training",
                    "Automatic follow-up for maximum client satisfaction"
                ]
            },
            leo: {
                name: "Leo",
                title: "Your Personal Assistant",
                subtitle: "Ask any question about your business.",
                points: [
                    "Knows everything about your business",
                    "Questions about invoices, clients, revenue",
                    "Tips to optimize your operations",
                    "Always available, never in the dark"
                ]
            },
            eva: {
                name: "Eva",
                title: "Your Overview",
                subtitle: "Make informed decisions. Invoice in 30 seconds.",
                points: [
                    "Connected to QuickBooks and your tools",
                    "Create invoices in 30 seconds",
                    "No more manual paperwork",
                    "Automatic sending to clients"
                ]
            }
        },
        features: {
            voice: {
                title: "Real Voice",
                desc: "We answer your calls and handle appointments. Like a real person, but without the vacation."
            },
            compliance: {
                title: "Compliance",
                desc: "Law 25, local hosting, Quebec data. No headaches."
            },
            freedom: {
                title: "Freedom",
                desc: "We're here to give you back control of your time. Do what you love, we handle the rest."
            }
        },
        proof: {
            title: "Compatible with your tools"
        },
        contact: {
            title: "Talk to a Human",
            description: "Enter your email and we'll call you back.",
            placeholder: "yourname@company.com",
            submit: "Send",
            success: "Thanks! We'll be in touch shortly."
        },
        cta: {
            title: "Ready to simplify your life?"
        },
        footer: {
            tagline: "Your AI Receptionist",
            address: "1475 Peel St, Suite 200, Montreal, QC H3A 1T1",
            email: "info@alma.quebec",
            copyright: "© 2026 Alma Technologies Inc."
        },
        login: {
            title: "Sign In",
            subtitle: "Access your business dashboard",
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
            heroSubtitle: "Your intelligent AI receptionist for the modern service business.",
            heroQuote: "\"The most efficient way to manage client communications. Simple, powerful, and invisible.\""
        },
        onboarding: {
            welcome: {
                title: "Welcome to Alma",
                subtitle: "Set up your intelligent AI receptionist in just a few steps."
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
                regionsPlaceholder: "e.g., Montreal, Quebec City, Toronto",
                description: "Tell us more about your business",
                descriptionPlaceholder: "What services do you offer? Who are your typical clients?",
                docsLabel: "Company Documents (Optional)",
                docsHint: "Upload brochures, service guides, or any documents that describe your business",
                dragDrop: "Drag & drop PDF or images here",
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
            subtitle: "Configure your receptionist Mia and manage company knowledge",
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
                trustedSourcesDesc: "Add URLs that you trust as reference sources. The chat assistant can use these to provide more accurate answers.",
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
            noInvoices: "No invoices yet. Upload one in Chat!",
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
