const {MessageEmbed} = require('discord.js');
const {formatWithRange} = require('./FormatUtils.js');

module.exports = class Embed extends MessageEmbed {
	static limits = {
		author: {
			name: 256,
		},
		title: 256,
		description: 2048,
		footer: {
			text: 2048,
		},
		fields: {
			size: 25,
			name: 256,
			value: 1024,
		},
	};

	static templates = {
		basic: {
			footer: {
				text: '${client.user.username}',
				iconURL: '${client.user.displayAvatarURL()}',
			},
			timestamp: new Date(),
		},
		color: {
			color: '#4b5afd',
		},
		get complete() {
			return {
				...this.basic,
				...this.color,
				title: '${title}',
				description: '${description}',
			};
		},
		get image() {
			return {
				...this.complete,
				image: {
					url: '${image}',
				},
			};
		},
		get author() {
			return {
				...this.basic,
				...this.color,
				author: {
					name: '${author}',
					iconURL: '${authorURL}',
				},
			};
		},
	};

	/**
	 * Créé un embed suivant une template.
	 * @param {Object | 'basic' | 'image' | 'complete' | 'author'} template - Le nom ou directement la template à inscrire.
	 * @param {{any}} values - Les valeurs par défaut de l'embed.
	 * @returns {Embed} - L'embed.
	 */
	static fromTemplate(template, values = {}) {
		if (!template) throw new Error(`Template '${template}' not found.`);
		if (typeof template === 'string')
			if (Embed.templates[template]) template = Embed.templates[template];
			else throw new Error(`Template '${template}' not found.`);

		template = JSON.parse(JSON.stringify(template));

		function setValues(object, values) {
			for (const [name, value] of Object.entries(object)) {
				if (!object.hasOwnProperty(name)) continue;
				if (Array.isArray(value)) object[name] = value.map(v => setValues(v, values));
				if (typeof value === 'object') {
					object[name] = setValues(value, values);
					continue;
				}

				const code = value.replace(/\$\{([^}]+)\}/gu, (_, value) => (values.hasOwnProperty(value.split('.')[0]) ? `\${values.${value}}` : value));
				object[name] = eval(`\`${code}\``);
			}

			return object;
		}

		return new Embed(setValues(template, values));
	}

	/**
	 * Check la taille des fields de l'embed, renvoie une erreur si une est trop grande.
	 */
	checkSize() {
		if (this.title?.length > Embed.limits.title) throw new RangeError(`embed.title is too long (${Embed.limits.title}).`);
		if (this.author?.name.length > Embed.limits.author.name) throw new RangeError(`embed.author.name is too long (${Embed.limits.author.name}).`);
		if (this.description?.length > Embed.limits.description) throw new RangeError(`embed.description is too long (${Embed.limits.description}).`);
		if (this.title?.length > Embed.limits.title) throw new RangeError(`embed.title is too long (${Embed.limits.title}).`);
		if (this.fields?.length > Embed.limits.fields.size) throw new RangeError(`Too much fields is too long (${Embed.limits.fields.size}).`);
		this.fields.forEach(field => {
			if (field.name?.length > Embed.limits.fields.name) throw new RangeError(`embed.fields[${this.fields.indexOf(field)}].name is too long (${Embed.limits.fields.name}).`);
			if (field.value?.length > Embed.limits.fields.value) throw new RangeError(`embed.fields[${this.fields.indexOf(field)}].value is too long (${Embed.limits.fields.value}).`);
		});
	}

	/**
	 * Les données à inclure de base dans un embed.
	 * @param {module:"discord.js".MessageEmbedOptions | MessageEmbed} data
	 */
	constructor(data) {
		super(data);
		this.checkSize();
	}

	/**
	 * Check la taile des fields de l'embed, le coupe automatiquement si un est trop grand.
	 */
	cutIfTooLong() {
		if (this.author?.name) this.author.name = formatWithRange(this.author.name ?? '', Embed.limits.author.name);
		this.description = formatWithRange(this.description ?? '', Embed.limits.description);
		this.title = formatWithRange(this.title ?? '', Embed.limits.title);
		if (this.fields) {
			if (this.fields.length > Embed.limits.fields.size) this.fields = this.fields.slice(0, Embed.limits.fields.size) ?? [];
			this.fields.forEach(field => {
				field.name = formatWithRange(field.name ?? '', Embed.limits.fields.name);
				field.value = formatWithRange(field.value ?? '', Embed.limits.fields.value);
			});
		}
	}
};
