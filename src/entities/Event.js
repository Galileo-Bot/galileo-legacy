/**
 * @type {import("../../index.d.ts").Event}
 */
module.exports = class Event {
	client;
	name;
	once = false;

	/**
	 * Créé un nouvel évent.
	 * @param {EventOptions} options - Options de l'évent.
	 */
	constructor(options) {
		Object.assign(this, options);
	}

	/**
	 * Execute l'évent.
	 * @param {GaliClient} client - Le client.
	 * @param {any} args - Les arguments supplémentaires de l'évent.
	 * @returns {Promise<void>}
	 */
	async run(client, ...args) {
		this.client = client;
		this.args = args;
	}
};
