module.exports = class Event {
	client;
	name;
	once;

	/**
	 * Créé un nouvel évent.
	 * @param {EventOptions} options - Options de l'évent.
	 */
	constructor(options) {
		this.name = options.name;
		this.once = options?.once ?? false;
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
