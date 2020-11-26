const Logger = require('./Logger.js');
const {MessageEmbed} = require('discord.js');

module.exports = class Embed extends MessageEmbed {
	static templates = {
		basic: {
			footer: {
				text: '${client.user.username}',
				iconURL: '${client.user.displayAvatarURL()}',
			},
		},
		image: {
			title: '${title}',
			description: 'Hey : ${description}',
			image: {
				url: '${image}',
			},
			footer: {
				text: '${client.user.username}',
				iconURL: '${client.user.displayAvatarURL()}',
			},
		},
		fields: {
			fields: [
				{
					name: 'bite',
					value: '${client.user.username}',
				},
			],
		},
	};

	static fromTemplate(template, values = {}) {
		if (typeof template === 'string') template = Embed.templates[template] || {};

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
		const limits = {
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

		if (this.title?.length > limits.title) throw new RangeError(`embed.title is too long (${limits.title}).`);
		if (this.author?.name.length > limits.author.name) throw new RangeError(`embed.author.name is too long (${limits.author.name}).`);
		if (this.description?.length > limits.description) throw new RangeError(`embed.description is too long (${limits.description}).`);
		if (this.title?.length > limits.title) throw new RangeError(`embed.title is too long (${limits.title}).`);
		if (this.fields?.length > limits.fields.size) throw new RangeError(`Too much fields is too long (${limits.fields.size}).`);
		this.fields.forEach(field => {
			if (field.name?.length > limits.fields.name) throw new RangeError(`embed.fields[${this.fields.indexOf(field)}].name is too long (${limits.fields.name}).`);
			if (field.value?.length > limits.fields.value) throw new RangeError(`embed.fields[${this.fields.indexOf(field)}].value is too long (${limits.fields.value}).`);
		});
	}
};
