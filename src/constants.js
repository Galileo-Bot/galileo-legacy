const {isCanary} = require('./main.js');
const {version} = require('../package.json');

const argTypes = {
	user: "Nom/Mention/ID d'utilisateur",
	user_id: "ID d'utilisateur",
	user_username: "Nom d'utilisateur",
	member: 'Nom/Mention/ID de membre',
	channel: 'Nom/Mention/ID de salon.',
	channel_id: 'ID de salon',
	channel_name: 'Nom de salon',
	guild: 'Nom/ID de serveur.',
	guild_id: 'ID de serveur',
	guild_name: 'Nom de serveur',
	role: 'Nom/Mention/ID de rôle',
	role_id: 'ID de rôle',
	role_name: 'Nom de rôle',
	command: 'Commande',
	number: 'Nombre',
	string: 'Texte',
};

const logTypes = {
	debug: '35',
	log: '37',
	info: '34',
	warn: '33',
	error: '31',
};

const categories = {
	administration: 'Administration',
	fun: 'Fun',
	hidden: 'Cachées',
	informations: 'Informations',
	moderation: 'Modération',
	owner: 'Gérants bot',
	utils: 'Utilitaires',
	wip: 'Non finies. (instables)',
};

const tags = {
	owner_only: 'Seulement disponible aux gérants du bot.',
	guild_only: 'Seulement disponible sur serveur.',
	dm_only: 'Seulement disponible en messages privés.',
	nsfw_only: 'Seulement disponible dans un salon NSFW.',
	guild_owner_only: 'Seulement disponible pour le propriétaire du serveur.',
	help_command: "Commande d'aide.",
	prefix_command: 'Commande des préfixes.',
	hidden: 'Cachée.',
	wip: 'Non finie (potentiellement instable).',
};

const userFlags = {
	DISCORD_EMPLOYEE: 'Employé chez Discord.',
	DISCORD_PARTNER: 'Partenaire de Discord.',
	HYPESQUAD_EVENTS: 'Participant des évents HypeSquad.',
	BUGHUNTER_LEVEL_1: 'Chercheur de bug de Discord niveau 1',
	HOUSE_BRAVERY: 'Fait partie de HypeSquad Bravoure.',
	HOUSE_BRILLIANCE: 'Fait partie de HypeSquad Brilliance.',
	HOUSE_BALANCE: 'Fait partie de HypeSquad Balance.',
	EARLY_SUPPORTER: 'A acheté Nitro dès son apparition.',
	TEAM_USER: "Utilisateur d'une team de l'API.",
	SYSTEM: 'Utilisateur faisant partie du système Discord.',
	BUGHUNTER_LEVEL_2: 'Chercheur de bug de Discord niveau 2',
	VERIFIED_BOT: 'Bot certifié ayant passé la validation.',
	VERIFIED_DEVELOPER: 'Développeur de bot certifié ayant passé la validation.',
};

const guildFeatures = {
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

const permissions = {
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

const randomActivities = [
	`[${isCanary ? 'g!' : 'g/'}help] Alpha`,
	"😷 N'oubliez pas votre masque !",
	'💻 Développeurs : Ayfri, Antow.',
	'Support disponible ici : https://discord.gg/n7HWd4P',
	'💻 | https://galileo-bot.tk',
	`🚀 Version : ${version} !`,
];

const channels = {
	addOrRemoveChannel: '544550120310439936',
	bugChannel: '515683210798301202',
	supportChannel: '544130287894790154',
	updatesChannel: '515326534727237636',
	galiChannels: {
		addServer: '636702915376971796',
		bug: '635248014419820545',
		command: '636636369984159806',
		mp: '636711377674829835',
		removeServer: '636702929151328295',
	},
	canaryChannels: {
		bug: '638476019774259252',
		command: '638476040565424178',
		mp: '638476058416381962',
	},
};

const emojis = {
	wait: '638831506126536718',
};

module.exports = {
	argTypes,
	categories,
	tags,
	logTypes,
	randomActivities,
	userFlags,
	guildFeatures,
	permissions,
	channels,
	emojis,
};
