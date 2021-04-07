/**
 * Coupe le texte en ajoutant '...' si il est plus long que la maxLength.
 * @param {string} text - Texte.
 * @param {number} maxLength - Longueur maximale.
 * @returns {string} - Texte coupé.
 */
function formatWithRange(text, maxLength) {
	return text.length > maxLength ? `${text.substring(0, maxLength - 3)}...` : text;
}

/**
 * Utile pour la commande "remind" par exemple.
 * @example
 * const result = getTime("Je veux attendre 5h");
 * console.log(result);
 * {
 *   type: 'h',
 *   value: 18000000 (1000 * 60 * 60 * 5)
 * }
 *
 * @param {string | string[]} args - Texte.
 * @returns {{type: string, value: number}} - Retourne un objet contenant le type de temps et le nombre de millisecondes.
 */
function getTime(args) {
	function setTime(text, time) {
		if (['d', 'j', 'jour', 'jours'].some(s => text.endsWith(s))) {
			time.value = 1000 * 60 * 60 * 24 * parseInt(text.slice(0, text.length - 1), 10);
			time.type = 'd';
		} else if (['h', 'heure', 'heures', 'hour', 'hours'].some(s => text.endsWith(s))) {
			time.value = 1000 * 60 * 60 * parseInt(text.slice(0, text.length - 1), 10);
			time.type = 'h';
		} else if (['m', 'minute', 'minutes'].some(s => text.endsWith(s))) {
			time.value = 1000 * 60 * parseInt(text.slice(0, text.length - 1), 10);
			time.type = 'm';
		} else if (['s', 'seconde', 'secondes', 'second', 'seconds'].some(s => text.endsWith(s))) {
			time.value = 1000 * parseInt(text.slice(0, text.length - 1), 10);
			time.type = 's';
		}
	}

	const time = {
		type: '',
		value: 0,
	};

	if (!args) return time;

	const argsArray = (typeof args === 'string' ? args : args.join(' ')).toLowerCase().trim().split(/ +/g);
	setTime(argsArray[argsArray.length - 1], time);
	if (time.value === 0 || Number.isNaN(time.value)) setTime(argsArray[0], time);

	return time;
}

/**
 * Permet de transformer un gros nombre en KB/MB/GB
 * @param {number} bytes - Le nombre d'octets
 * @returns {string} - Le résultat.
 */
function formatByteSize(bytes) {
	return bytes < 1000
		? `${bytes} octets`
		: bytes < 1000000
		? `${(bytes / 1000).toFixed(3)} KB`
		: bytes < 1000000000
		? `${(bytes / 1000000).toFixed(3)} MB`
		: `${(bytes / 1000000000).toFixed(3)} GB`;
}

module.exports = {
	formatByteSize,
	formatWithRange,
	getTime,
};
