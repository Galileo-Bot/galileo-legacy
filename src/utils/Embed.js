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
		image: {
			title: '${title}',
			description: '${description}',
			image: {
				url: '${image}',
			},
			footer: {
				text: '${client.user.username}',
				iconURL: '${client.user.displayAvatarURL()}',
			},
			timestamp: new Date(),
			color: '#4b5afd',
		},
		complete: {
			title: '${title}',
			description: '${description}',
			footer: {
				text: '${client.user.username}',
				iconURL: '${client.user.displayAvatarURL()}',
			},
			timestamp: new Date(),
			color: '#4b5afd',
		},
		author: {
			author: {
				name: '${author}',
				iconURL: '${authorURL}',
			},
			description: '${description}',
			footer: {
				text: '${client.user.username}',
				iconURL: '${client.user.displayAvatarURL()}',
			},
			timestamp: new Date(),
			color: '#4b5afd',
		},
	};

	static fromTemplate(template, values = {}) {
		if (!template) throw new Error(`Template '${template}' not found.`);
		if (typeof template === 'string')
			if (Embed.templates[template]) template = Embed.templates[template];
			else throw new Error(`Template '${template}' not found.`);

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
