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
	 * @returns {Promise<void>}
	 */
	async run(client) {
		this.client = client;
	}
};
