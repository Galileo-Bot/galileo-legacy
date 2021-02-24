import type {Client, ClientEvents, Collection, Message as DiscordMessage, MessageAdditions, MessageOptions, PermissionResolvable, Snowflake, StringResolvable} from 'discord.js';
import type Enmap from 'enmap';

//#region classes

export class GaliClient extends Client {
	public readonly dbManager: DBManager;
	public commandManager: CommandManager;
	public commands: typeof CommandManager.commands;
	public eventManager: EventManager;
	public events: typeof EventManager.events;
}

export class CommandManager {
	public static commands: Collection<string, Command>;

	public static findCommand(name: string): Command;

	public loadCommands(dirName: string): Promise<void>;

	public loadCommand(command: Command): void;

	public unloadCommand(command: Command): void;
}

export class EventManager {
	public static events: Collection<string, Event>;

	public readonly client: GaliClient;

	public constructor(client: GaliClient);

	public loadEvents(dirName: string): Promise<void>;

	public bind(event: Event): void;

	public unbind(event: Event): void;
}

export class Command {
	public aliases: string[];
	public category: Category;
	public clientPermissions: PermissionResolvable[];
	public cooldown: number;
	public description: string;
	public name: string;
	public tags: Tag[];
	public usage: string;
	public userPermissions: PermissionResolvable[];

	public message: Message;
	public client: GaliClient;
	public args: string[];

	public constructor(options: CommandOptions);

	public run(client: GaliClient, message: Message, args?: string[]): Promise<void>;

	public send(content: StringResolvable, options?: MessageOptions | (MessageOptions & {split?: false}) | MessageAdditions): Promise<Message>;
}

export class Event {
	public once: boolean;
	public client: GaliClient;
	public name: keyof ClientEvents;

	public constructor(options: EventOptions);

	public run(client: GaliClient, ...args: any[]): Promise<void>;
}

export class Logger {
	public static process(message: string, type: LogType, title?: string): void;

	public static log(message: any, title?: string): void;

	public static info(message: any, title?: string): void;

	public static debug(message: any, title?: string): void;

	public static warn(message: any, title?: string): void;

	public static error(message: any, title?: string): void;
}

export class DBManager {
	public readonly ready: boolean;

	public readonly messages: Enmap<string, string | number[]>;

	public readonly userInfos: Enmap<Snowflake, GuildMembers>;

	public readonly cache: Enmap<string, string>;

	public prepare(): Promise<void>;
}

//#endregion classes

//#region enum

export enum ArgType {
	USER = "Nom/Mention/ID d'utilisateur",
	USER_ID = "ID d'utilisateur",
	USER_USERNAME = "Nom d'utilisateur",
	MEMBER = 'Nom/Mention/ID de membre',
	CHANNEL = 'Nom/Mention/ID de salon.',
	CHANNEL_ID = 'ID de salon',
	CHANNEL_NAME = 'Nom de salon',
	GUILD = 'Nom/ID de serveur.',
	GUILD_ID = 'ID de serveur',
	GUILD_NAME = 'Nom de serveur',
	ROLE = 'Nom/Mention/ID de rôle',
	ROLE_ID = 'ID de rôle',
	ROLE_NAME = 'Nom de rôle',
	COMMAND = 'Commande',
	NUMBER = 'Nombre',
	STRING = 'Texte',
}

export enum Tag {
	OWNER_ONLY = 'Seulement disponible aux gérants du bot.',
	GUILD_ONLY = 'Seulement disponible sur serveur.',
	DM_ONLY = 'Seulement disponible en messages privés.',
	NSFW_ONLY = 'Seulement disponible dans un salon NSFW.',
	GUILD_OWNER_ONLY = 'Seulement disponible pour le propriétaire du serveur.',
	HELP_COMMAND = "Commande d'aide.",
	PREFIX_COMMAND = 'Commande des préfixes.',
	HIDDEN = 'Cachée.',
	WIP = 'Non finie (potentiellement instable).',
}

export enum LogType {
	DEBUG = '35',
	LOG = '37',
	INFO = '34',
	WARN = '33',
	ERROR = '31',
}

export enum Category {
	ADMINISTRATION = 'Administration',
	FUN = 'Fun',
	HIDDEN = 'Cachées',
	INFORMATIONS = 'Informations',
	MODERATION = 'Modération',
	OWNER = 'Gérants bot',
	UTILS = 'Utilitaires',
	WIP = 'Non finies. (instables)',
}

//#endregion enum

//#region types
export type Message = DiscordMessage;
export type GuildEventType = 'add' | 'remove';

export type GuildMembers = {
	[k in Snowflake]: UserInfo;
};

export type UserInfo = {
	sanctions: Sanction[];
};

export type Sanction = {
	type: 'warn' | 'ban' | 'mute';
	time?: number;
	reason: string;
	readonly case: number;
	readonly date: number;
};

export type CommandOptions = {
	aliases?: string[];
	category?: Category;
	clientPermissions?: PermissionResolvable[];
	cooldown?: number;
	description?: string;
	name: string;
	tags?: Tag[];
	usage?: string;
	userPermissions?: PermissionResolvable[];
};

export type MemeCommandOptions = CommandOptions & {
	argsNumber: number;
	argsMaxLength: number;
	templateID: number | string;
	font: string;
};

export type EventOptions = {
	name: string;
	once?: boolean;
};

export type GuildEventOptions = EventOptions & {
	type: GuildEventType;
};

export type MissingPermissions = {
	client: PermissionResolvable[];
	user: PermissionResolvable[];
};

export type CommandFail = {
	missingPermissions: MissingPermissions;
	tags: Tag[];
	cooldown: Snowflake | null;
	isFailed: boolean;
};

export type CooldownCommand = {
	command: string;
	releasingAt: Date;
};

//#endregion types
