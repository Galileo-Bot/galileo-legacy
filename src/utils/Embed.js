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
};
