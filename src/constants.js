const {getShortPrefix} = require('./utils/Utils.js');
const {version} = require('../package.json');

const ARG_TYPES = {
	CHANNEL: 'Nom/Mention/ID de salon.',
	CHANNEL_ID: 'ID de salon',
	CHANNEL_NAME: 'Nom de salon',
	COMMAND: 'Commande',
	DURATION: 'Durée',
	GUILD: 'Nom/ID de serveur.',
	GUILD_ID: 'ID de serveur',
	GUILD_NAME: 'Nom de serveur',
	MEMBER: 'Nom/Mention/ID de membre',
	NUMBER: 'Nombre',
	ROLE: 'Nom/Mention/ID de rôle',
	ROLE_ID: 'ID de rôle',
	ROLE_NAME: 'Nom de rôle',
	STRING: 'Texte',
	USER: "Nom/Mention/ID d'utilisateur",
	USER_ID: "ID d'utilisateur",
	USER_USERNAME: "Nom d'utilisateur",
};

const LOG_TYPES = {
	DEBUG: '35',
	ERROR: '31',
	INFO: '34',
	LOG: '37',
	WARN: '33',
};

const CATEGORIES = {
	ADMINISTRATION: 'Administration',
	FUN: 'Fun',
	HIDDEN: 'Cachées',
	INFORMATIONS: 'Informations',
	MODERATION: 'Modération',
	OWNER: 'Gérants bot',
	UTILS: 'Utilitaires',
	WIP: 'Non finies. (instables)',
};

const TAGS = {
	DM_ONLY: 'Seulement disponible en messages privés.',
	GUILD_ONLY: 'Seulement disponible sur serveur.',
	GUILD_OWNER_ONLY: 'Seulement disponible pour le propriétaire du serveur.',
	HELP_COMMAND: "Commande d'aide.",
	HIDDEN: 'Cachée.',
	NSFW_ONLY: 'Seulement disponible dans un salon NSFW.',
	OWNER_ONLY: 'Seulement disponible aux gérants du bot.',
	PREFIX_COMMAND: 'Commande des préfixes.',
	WIP: 'Non finie (potentiellement instable).',
};

const USER_FLAGS = {
	BUGHUNTER_LEVEL_1: 'Chercheur de bug de Discord de niveau 1',
	BUGHUNTER_LEVEL_2: 'Chercheur de bug de Discord de niveau 2',
	DISCORD_EMPLOYEE: 'Employé chez Discord.',
	DISCORD_PARTNER: 'Partenaire de Discord.',
	EARLY_SUPPORTER: 'A acheté Nitro dès son apparition.',
	HOUSE_BALANCE: 'Fait partie de HypeSquad Balance.',
	HOUSE_BRAVERY: 'Fait partie de HypeSquad Bravoure.',
	HOUSE_BRILLIANCE: 'Fait partie de HypeSquad Brilliance.',
	HYPESQUAD_EVENTS: 'Participant des évents HypeSquad.',
	SYSTEM: 'Utilisateur faisant partie du système Discord.',
	TEAM_USER: "Utilisateur d'une team de l'API.",
	VERIFIED_BOT: 'Bot certifié ayant passé la validation dès le début.',
	VERIFIED_DEVELOPER: 'Développeur de bot certifié ayant passé la validation dès le début.',
};

const GUILD_FEATURES = {
	ANIMATED_ICON: "Possibilité d'avoir une icône animée.",
	BANNER: "Possibilité d'avoir une bannière.",
	COMMERCE: 'Possibilité de créer des salons de shopping.',
	COMMUNITY: 'Serveur communautaire.',
	DISCOVERABLE: "Possibilité d'être listé dans la liste des serveurs de Discord.",
	FEATURABLE: "Possibilité d'être affiché dans la liste des serveurs de Discord.",
	INVITE_SPLASH: "Possibilité d'avoir un fond d'écran dans les invitations.",
	NEWS: "Possibilité d'avoir des salons d'annonces.",
	PARTNERED: 'Partenaire avec Discord.',
	VANITY_URL: "Possibilité d'avoir une invitation avec un vrai nom.",
	VERIFIED: 'Serveur vérifié.',
	VIP_REGIONS: 'Accès à la meilleure qualité audio.',
	WELCOME_SCREEN_ENABLED: 'Menu de bienvenue activé.',
};

const PERMISSIONS = {
	ADD_REACTIONS: 'Ajouter des réactions.',
	ADMINISTRATOR: 'Administrateur',
	ATTACH_FILES: 'Poster des fichiers.',
	BAN_MEMBERS: 'Bannir des membres.',
	CHANGE_NICKNAME: 'Changer son surnom.',
	CONNECT: 'Se connecter à un salon vocal.',
	CREATE_INSTANT_INVITE: 'Créer une invitation.',
	DEAFEN_MEMBERS: 'Rendre sourd des gens en vocal.',
	EMBED_LINKS: 'Envoyer des liens avec des embeds.',
	KICK_MEMBERS: 'Éjecter des membres.',
	MANAGE_CHANNELS: 'Gérer les salons.',
	MANAGE_EMOJIS: 'Gérer les émojis.',
	MANAGE_GUILD: 'Gérer le serveur.',
	MANAGE_MESSAGES: 'Gérer les messages.',
	MANAGE_NICKNAMES: 'Gérer les surnoms.',
	MANAGE_ROLES: 'Gérer les rôles.',
	MANAGE_WEBHOOKS: 'Gérer les webhooks.',
	MENTION_EVERYONE: 'Mentionner **everyone** et **here** et tous les autres rôles.',
	MOVE_MEMBERS: 'Déplacer des membres en appels vocaux.',
	MUTE_MEMBERS: 'Rendre muet des gens en vocal.',
	PRIORITY_SPEAKER: 'Avoir la priorité sonore en appels vocaux.',
	READ_MESSAGE_HISTORY: 'Lire les anciens messages.',
	SEND_MESSAGES: 'Envoyer des messages.',
	SEND_TTS_MESSAGES: 'Envoyer des messages TTS.',
	SPEAK: 'Parler en appel vocal.',
	STREAM: 'Faire un stream Discord.',
	USE_EXTERNAL_EMOJIS: 'Utiliser des émojis externes.',
	USE_VAD: 'Utiliser la détection de voix.',
	VIEW_AUDIT_LOG: 'Voir les logs du serveur.',
	VIEW_CHANNEL: 'Voir les salons.',
	VIEW_GUILD_INSIGHTS: 'Voir les informations du serveur.',
};

const RANDOM_ACTIVITIES = [
	`[${getShortPrefix()}help]`,
	"😷 N'oubliez pas votre masque !",
	'💻 Développeurs : Ayfri, Antow.',
	'Support disponible ici : https://discord.gg/n7HWd4P',
	`🚀 Version : ${version} !`,
];

const CHANNELS = {
	ADD_OR_REMOVE_CHANNEL: '544550120310439936',
	BUG_CHANNEL: '515683210798301202',
	CANARY_CHANNELS: {
		BUG: '638476019774259252',
		COMMAND: '638476040565424178',
		MP: '638476058416381962',
	},
	GALI_CHANNELS: {
		ADD_GUILD: '636702915376971796',
		BUG: '635248014419820545',
		COMMAND: '636636369984159806',
		MP: '636711377674829835',
		RATE_LIMIT: '764567172839637008',
		REMOVE_GUILD: '636702929151328295',
	},
	SUPPORT_CHANNEL: '544130287894790154',
	UPDATES_CHANNEL: '515326534727237636',
};

const EMOJIS = {
	WAIT: '638831506126536718',
};

module.exports = {
	ARG_TYPES,
	CATEGORIES,
	CHANNELS,
	EMOJIS,
	GUILD_FEATURES,
	LOG_TYPES,
	PERMISSIONS,
	RANDOM_ACTIVITIES,
	TAGS,
	USER_FLAGS,
};
