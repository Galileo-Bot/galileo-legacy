import {
	Client,
	ClientEvents,
	Collection,
	Message as DiscordMessage,
	MessageAdditions,
	MessageEmbed,
	MessageOptions,
	PermissionResolvable,
	Snowflake,
	StringResolvable,
} from 'discord.js';

//#region classes

export class GaliClient extends Client {
	public commandManager: CommandManager;
	public commands: Collection<string, Command>;
	public eventManager: EventManager;
	public events: Collection<string, Event>;
	public get isCanary(): boolean;
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
	
	constructor(client: GaliClient);
	
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
	
	public send(
		content: StringResolvable,
		options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions,
	): Promise<Message>;
}

export class Event {
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

//#endregion classes

//#region enum

export enum ArgType {
	user = 'Nom/Mention/ID d\'utilisateur',
	user_id = 'ID d\'utilisateur',
	user_username = 'Nom d\'utilisateur',
	member = 'Nom/Mention/ID de membre',
	channel = 'Nom/Mention/ID de salon.',
	channel_id = 'ID de salon',
	channel_name = 'Nom de salon',
	guild = 'Nom/ID de serveur.',
	guild_id = 'ID de serveur',
	guild_name = 'Nom de serveur',
	role = 'Nom/Mention/ID de rôle',
	role_id = 'ID de rôle',
	role_name = 'Nom de rôle',
	command = 'Commande',
	number = 'Nombre',
	string = 'Texte'
}

export enum Tag {
	owner_only = 'Seulement disponible aux gérants du bot.',
	guild_only = 'Seulement disponible sur serveur.',
	dm_only = 'Seulement disponible en messages privés.',
	nsfw_only = 'Seulement disponible dans un salon NSFW.',
	guild_owner_only = 'Seulement disponible pour le propriétaire du serveur.',
	help_command = 'Commande d\'aide.',
	prefix_command = 'Commande des préfixes.',
	hidden = 'Cachée.',
	wip = 'Non finie (potentiellement instable).'
}

export enum LogType {
	debug = '35',
	log = '37',
	info = '34',
	warn = '33',
	error = '31'
}

export enum Category {
	administration = 'Administration',
	fun = 'Fun',
	hidden = 'Cachées',
	informations = 'Informations',
	moderation = 'Modération',
	owner = 'Gérants bot',
	utils = 'Utilitaires',
	wip = 'Non finies. (instables)'
}

//#endregion enum

//#region types
export type Message = DiscordMessage;
export type Embed = MessageEmbed;
export type GuildEventType = 'add' | 'remove';
//#endregion types

//#region interfaces

export interface CommandOptions {
	aliases?: string[];
	category?: Category;
	clientPermissions?: PermissionResolvable[];
	cooldown?: number;
	description?: string;
	name: string;
	tags?: Tag[];
	usage?: string;
	userPermissions?: PermissionResolvable[];
}

export interface MemeCommandOptions extends CommandOptions {
	argsNumber: number;
	argsMaxLength: number;
	templateID: number | string;
	font: string;
}

export interface EventOptions {
	name: string;
	once?: boolean;
}

export interface GuildEventOptions extends EventOptions {
	type: GuildEventType;
}

export interface MissingPermissions {
	client: PermissionResolvable[];
	user: PermissionResolvable[];
}

export interface CommandFail {
	missingPermissions: MissingPermissions;
	tags: Tag[];
	cooldown: Snowflake | null;
	isFailed: boolean;
}

export interface CooldownCommand {
	command: string;
	releasingAt: Date;
}

//#endregion interfaces
