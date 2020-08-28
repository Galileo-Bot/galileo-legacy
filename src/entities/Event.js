/**
 * @module Gali/Event
 */
module.exports = class Event {
	name;
	once;
	client;
	
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
