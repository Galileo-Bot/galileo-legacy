const Command = require('../../entities/Command.js');
const os = require('os');
const Embed = require('../../utils/Embed.js');
const {formatDate, formatRelativeDate} = require('../../utils/FormatUtils.js');
const {Octokit} = require('@octokit/core');

module.exports = class StatsCommand extends Command {
	constructor() {
		super({
			name: 'stats',
			description: "Permet d'obtenir des informations sur le bot.",
			aliases: ['bi', 'botinfo', 'stat'],
		});
	}

	/**
	 * Représente l'tilisation du CPU.
	 * @typedef {object} CPUUsage
	 * @property {number} idle - Le temps où le CPU n'a pas travaillé.
	 * @property {number} total - Le temps où le CPU a travaillé.
	 * @property {number} percentage - Le pourcentage d'utilisation.
	 */

	/**
	 * Renvoie des statistiques sur le CPU.
	 * @returns {{total: number, idle: number}} - Les statistiques du CPU.
	 */
	static getCPUInfos() {
		const cpus = os.cpus();

		const cpuStat = {
			user: 0,
			nice: 0,
			sys: 0,
			idle: 0,
			irq: 0,
			total: 0,
		};

		for (const cpu of cpus) {
			cpuStat.user += cpu.times.user;
			cpuStat.nice += cpu.times.nice;
			cpuStat.sys += cpu.times.sys;
			cpuStat.irq += cpu.times.irq;
			cpuStat.idle += cpu.times.idle;
		}

		const total = cpuStat.user + cpuStat.nice + cpuStat.sys + cpuStat.idle + cpuStat.irq;

		return {
			idle: cpuStat.idle,
			total,
		};
	}

	/**
	 * Retourne l'utilisation du CPU.
	 * @returns {Promise<CPUUsage>} - L'objet contenant les statistiques du CPU.
	 */
	static getCPUUsage() {
		const stats = StatsCommand.getCPUInfos();
		const startIdle = stats.idle;
		const startTotal = stats.total;

		const result = {
			idle: 0,
			total: 0,
			percentage: 0,
		};

		return new Promise(resolve =>
			setTimeout(() => {
				const newStats = StatsCommand.getCPUInfos();
				const endIdle = newStats.idle;
				const endTotal = newStats.total;

				result.idle = endIdle - startIdle;
				result.total = endTotal - startTotal;
				result.percentage = Number((1 - result.idle / result.total).toFixed(4));

				resolve(result);
			}, 1000)
		);
	}

	/**
	 * Retourne l'utilisation de la mémoire dans le serveur.
	 * @returns {string} - Le nombre de mégas utilisés par le PC.
	 */
	static getMemoryUsed() {
		return ((os.totalmem() - os.freemem()) / (1024 * 1024)).toFixed(2);
	}

	/**
	 * Retourne l'utilisation de la mémoire du process.
	 * @returns {string} - Le nombre de mégas utilisés par le processus.
	 */
	static getProcessMemoryUsage() {
		return (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2);
	}

	/**
	 * Renvoie le nombre d'utilisateurs complet du bot.
	 * @returns {Promise<number>} - Nombre d'utilisateurs.
	 * @private
	 */
	async getCountUsers() {
		await Promise.all(this.client.guilds.cache.map(guild => guild.members.fetch()));
		return this.client.users.cache.size;
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const octokit = new Octokit({
			auth: process.env.OCTOKIT_TOKEN,
		});
		const lastRelease = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
			owner: 'Galileo-Bot',
			repo: 'galileo',
		});

		const embed = Embed.fromTemplate('basic', {
			client,
		});
		embed.setColor('DARKER_GREY');
		embed.setThumbnail(client.user.displayAvatarURL());
		embed.setAuthor('Statistiques du bot', client.user.displayAvatarURL());
		embed.addField('🖥 Nombre de serveurs :', client.guilds.cache.size, true);
		embed.addField("👥 Nombre d'utilisateurs :", await this.getCountUsers(), true);
		embed.addField('📋 Nombre de salons : ', client.channels.cache.size, true);
		embed.addField(
			'💿 Utilisation de la RAM :',
			`> Serveur : **${StatsCommand.getMemoryUsed()}** MB / **${(os.totalmem() / (1024 * 1024)).toFixed(0)}** MB\n> Bot : **${StatsCommand.getProcessMemoryUsage()}** MB`
		);
		embed.addField('<:cpu:736643846812729446> Utilisation du CPU :', `${(await StatsCommand.getCPUUsage()).percentage.toFixed(2)}%`);
		embed.addField('🕦 Temps de fonctionnement', formatRelativeDate('dd jours hh heures mm minutes ss secondes', new Date(client.uptime)));
		embed.addField('<:bot:539121198634762261> Version du bot :', lastRelease.data.name, true);
		embed.addField("📆 Date de l'update :", formatDate('jj MMM yyyy', new Date(lastRelease.data.published_at)), true);

		await super.send(embed);
	}
};
