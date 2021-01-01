/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const {BetterEmbed} = require('discord.js-better-embed');
const constants = require('../../constants.js');
const Command = require('../../entities/Command.js');
const {getPrefixFromMessage} = require('../../utils/Utils.js');
const {formatByteSize} = require('../../utils/FormatUtils.js');
const {inspect} = require('util');

function exec(callback) {
	try {
		return callback();
	} catch (error) {
		return error;
	}
}

async function wait(callback) {
	try {
		return await callback();
	} catch (error) {
		return error;
	}
}

module.exports = class EvalCommand extends Command {
	static debug = false;
	static functionsPassages = [];
	static log = false;

	constructor() {
		super({
			aliases: ['return', 'js'],
			cooldown: 10,
			description: 'Permet de tester du code :warning:**AUCUNE LIMITE (require permis).** :warning:.',
			name: 'eval',
			tags: [constants.tags.owner_only],
			usage: 'eval <code>',
		});
	}

	static cutText(text) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('cutText');
		const newText = [];

		if (text) {
			if (text.length >= 2000) {
				for (let i = 0; i < text.length / 1990; i++) {
					newText.push(text.slice(i * 1990, (i + 1) * 1990));
				}
			} else {
				newText.push(text);
			}
		}

		return newText;
	}

	static del(guild, message) {
		EvalCommand.delMsg(guild, message);
	}

	static delMsg(guild, message) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('delMsg');
		if (guild.me.permissions.has('MANAGE_MESSAGES', false)) message.delete();
	}

	static getChannel(guild, find) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('getChannel');
		find = find.toLowerCase();
		return guild.channels.cache.get(find) || guild.channels.cache.find(m => m['name'].toLowerCase().includes(find)) || EvalCommand.sendJS('GetError : Nothing found.');
	}

	static getMember(guild, find) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('getMember');
		find = find.toLowerCase();
		return (
			guild?.members.cache?.get(find) ||
			guild?.members.cache?.find(m => m['displayName'].toLowerCase().includes(find) || m['user'].username.toLowerCase().includes(find)) ||
			EvalCommand.sendJS('GetError : Nothing found.')
		);
	}

	static inspect(object, depth = 2) {
		return inspect(object, {
			depth,
			maxArrayLength: 200,
			showHidden: true,
			sorted: true,
		});
	}

	static listKeys(channel, object) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('listKeys');
		if (typeof object !== 'object') return EvalCommand.sendJS(`ConvertError : ${object} is not an object.`);
		return EvalCommand.sendJS(channel, Object.keys(object).sort(new Intl.Collator().compare).join('\n'));
	}

	static listProps(channel, object, lang = 'js') {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('listProps');
		let toSend = '';
		for (const key of Object.getOwnPropertyNames(object).sort(new Intl.Collator().compare)) {
			let classOfObject = 'void',
				value = object[key];
			if (value !== null && value.constructor) classOfObject = value.constructor.name;
			if (!['String', 'Boolean', 'void', 'Number', 'Array', 'Message'].includes(classOfObject)) value = typeof value;
			if (!value) value = 'undefined';
			if (value.length === 0) value = '[Object object]';
			toSend += `${key} = ${value} (${classOfObject})\n`;
		}

		return EvalCommand.sendMarkdown(channel, toSend, lang);
	}

	static logFunctionsPassages() {
		EvalCommand.sendJS(EvalCommand.functionsPassages.join('➡\n'));
	}

	static send(channel, text) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('send');
		EvalCommand.verifyText(text);
		if (channel.type === 'text') return channel.send(text);
	}

	static sendBig(channel, text, markdown) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('sendBig');
		text = EvalCommand.cutText(text.toString());
		markdown
			? typeof markdown === 'string'
				? text.forEach(t => EvalCommand.sendMarkdown(channel, t, markdown))
				: text.forEach(t => EvalCommand.sendJS(channel, t))
			: text.forEach(t => EvalCommand.send(t));
	}

	static sendJS(channel, text) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('sendJS');
		text = EvalCommand.cutText(text);
		for (let i = 0; i < text.length; i++) {
			EvalCommand.sendMarkdown(channel, text[i], 'js');
		}
	}

	static sendMarkdown(channel, text, lang) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('sendMarkdown');
		return EvalCommand.send(channel, `\`\`\`${lang}\n${text}\`\`\``);
	}

	static sendMp(user, text) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('sendMp');
		EvalCommand.verifyText(text);
		user.send(text);
	}

	static sendTo(channel, client, text, id) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('sendTo');
		if (EvalCommand.debug) channel.send(text);
		return client.channels.cache.has(id)
			? client.channels.cache.get(id).send(text)
			: client.users.cache.has(id)
				? client.users.cache.get(id).send(text)
				: EvalCommand.sendJS('GetError : Nothing found.');
	}

	static sizeOf(object) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('sizeOf');
		const objectList = [];
		const recurse = value => {
			let bytes = 0;

			if (typeof value === 'boolean') {
				bytes = 4;
			} else if (typeof value === 'string') {
				// Algorithme pour récupérer la	taille d'un array.
				for (let i = 0; i < value.length; i++) {
					const partCount = encodeURI(value[i]).split('%').length;
					bytes += partCount === 1 ? 1 : partCount - 1;
				}
			} else if (typeof value === 'symbol') {
				bytes = 0;
			} else if (typeof value === 'number') {
				bytes = 8;
			} else if (typeof value === 'bigint') {
				// Algorithme pour récupérer la taille d'un BigInt.
				bytes = (2 + Math.ceil(value > 0n ? value.toString(2) : Number((~value).toString(2)) / 64)) * 64;
			} else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
				objectList[objectList.length] = value;
				for (const i in value) {
					if (value.hasOwnProperty(i)) {
						bytes += 8; // an assumed existence overhead
						bytes += recurse(value[i]);
					}
				}
			}

			return bytes;
		};

		return formatByteSize(recurse(object));
	}

	static stringify(channel, object, depth = 2) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('stringify');
		return EvalCommand.sendBig(channel, EvalCommand.inspect(object, depth), true);
	}

	static verifyText(channel, text) {
		if (EvalCommand.log) EvalCommand.functionsPassages.push('verifyText');
		if (EvalCommand.debug) channel.send(text);

		if (!text) text = 'undefined';
		if (!text.toString() && !text.toString().length) text = text.toString();
		if (!text.length) return EvalCommand.sendJS(channel, 'EvalError : Cannot send an empty message.');
		if (text.length > 2000) return EvalCommand.sendJS(channel, 'EvalError : Cannot send more than 2000 characters in one message.');
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		let retour = null;
		let code = message.content.slice(getPrefixFromMessage(message).length + this.name.length);
		let _logTime = false;
		EvalCommand.debug = code.includes('$debug');
		EvalCommand.log = code.includes('$log');

		const {guild, content, member, author, channel} = message;
		const members = guild ? guild.members.cache : null;

		if (code.includes('```')) code = code.replace(/```([a-z0-9]+)?/g, '');

		function logTime() {
			_logTime = true;
		}

		function send(text) {
			return EvalCommand.send(channel, text);
		}

		function sendTo(text, id) {
			return EvalCommand.sendTo(channel, client, text, id);
		}

		function getChannel(find) {
			return EvalCommand.getChannel(guild, find);
		}

		function getMember(find) {
			return EvalCommand.getMember(guild, find);
		}

		function sendMp(text) {
			return EvalCommand.sendMp(message.author, text);
		}

		function verifyText(text) {
			return EvalCommand.verifyText(channel, text);
		}

		function sendJS(text) {
			return EvalCommand.sendJS(channel, text);
		}

		function sendBig(text, markdown) {
			return EvalCommand.sendBig(channel, text, markdown);
		}

		function delMsg() {
			return EvalCommand.del(guild, message);
		}

		function del() {
			return EvalCommand.del(guild, message);
		}

		function stringify(object, depth) {
			return EvalCommand.stringify(channel, object, depth);
		}

		function listProps(object, lang) {
			return EvalCommand.listProps(object, lang);
		}

		function listKeys(object) {
			return EvalCommand.listKeys(object);
		}

		function sizeOf(object) {
			return EvalCommand.sizeOf(object);
		}

		function inspect(object, depth) {
			return EvalCommand.inspect(object, depth);
		}

		function functions() {
			if (EvalCommand.log) EvalCommand.functionsPassages.push('functions');
			const functions = [
				'cutText',
				'delMsg',
				'getChannel',
				'getFirstCreated',
				'getFirstJoined',
				'getMember',
				'listKeys',
				'listProps',
				'logTime',
				'sendBig',
				'sendJS',
				'sendMarkdown',
				'sendMp',
				'sendTo',
				'sizeOf',
				'stringify',
				'verifyText',
			];
			return EvalCommand.sendJS(channel, functions.sort(new Intl.Collator().compare).join('\n'));
		}

		try {
			if (_logTime) code = `console.time(';')\n${code}\n console.timeEnd(';')`;
			code = code.includes('await') ? `wait(async function(){\n\t${code}\n})` : `exec(function(){\n\t${code}\n})`;

			retour = await eval(code);
			if (EvalCommand.log) EvalCommand.logFunctionsPassages();
			if (retour) sendJS(retour);

			await message.react('✔');
		} catch (err) {
			await message.react('❗');
			Error.stackTraceLimit = 3;
			sendJS(err.stack);
		}
	}
};
