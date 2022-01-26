// Based on https://github.com/Katochimoto/strptime (MIT)

const locale = {
	a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	B: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
	f: [
		'Jan.',
		'Feb.',
		'Mar.',
		'Apr.',
		'May',
		'Jun.',
		'Jul.',
		'Aug.',
		'Sep.',
		'Oct.',
		'Nov.',
		'Dec.',
	],
	c: '%Y-%m-%d %H:%M:%S',
	P: ['am', 'pm'],
	r: '%I:%M:%S %p',
	x: '%m/%d/%y',
	X: '%H:%M:%S',
	day: ['Yesterday', 'Today', 'Tomorrow'],

	// алиас падежа обязательно указать после обозначения
	bg: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	Bg: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
	fg: [
		'Jan.',
		'Feb.',
		'Mar.',
		'Apr.',
		'May',
		'Jun.',
		'Jul.',
		'Aug.',
		'Sep.',
		'Oct.',
		'Nov.',
		'Dec.',
	],

	Date_dBY_year_in_HM: '%#B %-d, %Y at %-H:%M',
	Date_dBY_year: '%#B %-d, %Y',
	Date_dBY: '%#B %-d, %Y',
	Date_AdBY: '%A, %#B %-d, %Y',
	Date_dBA: '%#B %-d, %A',
	Date_df_in_HM: '%#f, %-d at %-H:%M',
	Date_dfY: '%-d %#f %Y',
	Date_dB_in_HM: '%#B %-d at %-H:%M',
	Date_df: '%-d %#f',
}

const strRegNum2 = '[\\d\\s]?\\d'
const strRegStr = '\\S+'

const specifiers: Record<
	string,
	string | { reg: string; make: (date: Date, data: string, mod: string, gen: boolean) => boolean }
> = {
	'%': '\\%',
	// Abbreviated week day name
	a: strRegStr,
	// Full week day name
	A: strRegStr,
	// Abbreviated month name
	b: {
		reg: strRegStr,
		make: (date: Date, data: string, mod: string, gen: boolean) => {
			const index = (gen ? locale.bg : locale.b).indexOf(toLetterCaseReverse(data, mod))
			if (index === -1) return false
			date.setUTCMonth(index)
			return true
		},
	},
	// Full month name
	B: {
		reg: strRegStr,
		make: function (date: Date, data: string, mod: string, gen: boolean) {
			const index = (gen ? locale.Bg : locale.B).indexOf(toLetterCaseReverse(data, mod))
			if (index === -1) return false

			date.setUTCMonth(index)
			return true
		},
	},
	// Abbreviated month name, but with a period
	f: {
		reg: strRegStr,
		make: function (date: Date, data: string, mod: string, gen: boolean) {
			const index = (gen ? locale.fg : locale.f).indexOf(toLetterCaseReverse(data, mod))
			if (index === -1) return false

			date.setUTCMonth(index)
			return true
		},
	},

	// Two digit year number
	g: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			let year = parseInt(data, 10)
			if (year < 0 || year > 99) {
				return false
			}

			year = year + 100 * Math.floor(new Date().getUTCFullYear() / 100)
			date.setUTCFullYear(year)
			return true
		},
	},
	// Four digit year number
	G: {
		reg: '\\d{4}',
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// date.setUTCFullYear(data)
			// return true
			const year = parseInt(data, 10)
			date.setUTCFullYear(year)
			return true
		},
	},
	// двухзначное представление дня месяца (с ведущими нулями)
	// Two digit day of the month (with leading zeros)
	d: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// if (data < 1 || data > 31) {
			// 	return false
			// }
			// date.setUTCDate(data)
			// return true
			const day = parseInt(data, 10)
			if (day < 1 || day > 31) return false
			date.setUTCDate(day)
			return true
		},
	},
	// день месяца, с ведущим пробелом, если он состоит из одной цифры
	// Day of the month, with a leading zero if necessary (01-31)
	e: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// if (data < 1 || data > 31) {
			// 	return false
			// }
			// date.setUTCDate(data)
			// return true
			const day = parseInt(data, 10)
			if (day < 1 || day > 31) return false
			date.setUTCDate(day)
			return true
		},
	},

	// двухзначный номер часа в 24-часовом формате
	// Two digit hour in 24-hour format (00-23)
	H: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// if (data < 0 || data > 23) {
			// 	return false
			// }
			// date.setUTCHours(data)
			// return true
			const hour = parseInt(data, 10)
			if (hour < 0 || hour > 23) return false
			date.setUTCHours(hour)
			return true
		},
	},
	// двухзначный номер часа в 12-часовом формате
	// Two digit hour in 12-hour format (01-12)
	I: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// if (data < 1 || data > 12) {
			// 	return false
			// }

			// date.setUTCHours(date.getUTCHours() + data)
			// return true
			const hour = parseInt(data, 10)
			if (hour < 1 || hour > 12) return false
			date.setUTCHours(date.getUTCHours() + hour)
			return true
		},
	},
	// двухзначный порядковый номер месяца (с ведущими нулями)
	// Two digit month number (with leading zeros)
	m: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// if (data < 1 || data > 12) {
			// 	return false
			// }
			// date.setUTCMonth(data - 1)
			// return true
			const month = parseInt(data, 10)
			if (month < 1 || month > 12) return false
			date.setUTCMonth(month - 1)
			return true
		},
	},
	// двухзначный номер минуты (с ведущими нулями)
	// Two digit minute (with leading zeros)
	M: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// if (data < 0 || data > 59) {
			// 	return false
			// }
			// date.setUTCMinutes(data)
			// return true
			const minute = parseInt(data, 10)
			if (minute < 0 || minute > 59) return false
			date.setUTCMinutes(minute)
			return true
		},
	},
	n: '\\n',
	// 'AM' или 'PM' в верхнем регистре, в зависимости от указанного времени
	// 'AM' or 'PM' in upper case, depending on the specified time
	p: {
		reg: strRegStr,
		make: function (date: Date, data: string) {
			// data = inArray.call(locale.P, data.toLowerCase())
			// if (data === -1) {
			// 	return false
			// }

			// if (data === 1) {
			// 	date.setUTCHours(date.getUTCHours() + 12)
			// }

			// return true
			const ampm = locale.P.indexOf(data.toLowerCase())
			if (ampm === -1) return false
			if (ampm === 1) date.setUTCHours(date.getUTCHours() + 12)
			return true
		},
	},
	// 'am' или 'pm' в зависимости от указанного времени
	// 'am' or 'pm' depending on the specified time
	P: {
		reg: strRegStr,
		make: function (date: Date, data: string) {
			// data = inArray.call(locale.P, data.toLowerCase())
			// if (data === -1) {
			// 	return false
			// }

			// if (data === 1) {
			// 	date.setUTCHours(date.getUTCHours() + 12)
			// }

			// return true
			const ampm = locale.P.indexOf(data.toLowerCase())
			if (ampm === -1) return false
			if (ampm === 1) date.setUTCHours(date.getUTCHours() + 12)
			return true
		},
	},

	// двухзначный номер секунды (с ведущими нулями)
	// Two digit second (with leading zeros)
	S: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// if (data < 0 || data > 60) {
			// 	return false
			// }
			// date.setUTCSeconds(data)
			// return true
			const second = parseInt(data, 10)
			if (second < 0 || second > 60) return false
			date.setUTCSeconds(second)
			return true
		},
	},
	t: '\\t',
	u: '\\d',
	U: strRegNum2,
	w: '\\d',
	W: strRegNum2,
	// последние 2 цифры года
	// Last two digits of the year
	y: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// if (data < 0 || data > 99) {
			// 	return false
			// }

			// data = data + 100 * parseInt(new Date().getUTCFullYear() / 100, 10)
			// date.setUTCFullYear(data)
			// return true
			let year = parseInt(data, 10)
			if (year < 0 || year > 99) return false
			year = year + 100 * Math.floor(new Date().getUTCFullYear() / 100)
			date.setUTCFullYear(year)
			return true
		},
	},
	// год
	// year
	Y: {
		reg: '\\d{4}',
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// date.setUTCFullYear(data)
			// return true
			const year = parseInt(data, 10)
			date.setUTCFullYear(year)
			return true
		},
	},
	z: {
		reg: '[+\\-]\\d{4}',
		make: function (date: Date, data: string) {
			// const m = data.match(/^([+\-])(\d{2})(\d{2})$/)
			// if (!m) {
			// 	return false
			// }

			// let offset = (parseInt(m[2], 10) * 60 + parseInt(m[3], 10)) * 60000
			// if (m[1] === '+') {
			// 	offset = -offset
			// }

			// date.setTime(date.getTime() + offset)

			// return true
			const m = data.match(/^([+-])(\d{2})(\d{2})$/)
			if (!m) return false
			let offset = (parseInt(m[2]) * 60 + parseInt(m[3])) * 60000
			if (m[1] === '+') offset = -offset
			date.setTime(date.getTime() + offset)
			return true
		},
	},
	l: {
		reg: strRegNum2,
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// if (data < 1 || data > 12) {
			// 	return false
			// }

			// date.setUTCHours(date.getUTCHours() + data)
			// return true
			const month = parseInt(data)
			if (month < 1 || month > 12) return false
			date.setUTCHours(date.getUTCHours() + month)
			return true
		},
	},
	// метка времени Эпохи Unix
	// Unix timestamp
	s: {
		reg: '\\d+',
		make: function (date: Date, data: string) {
			// data = parseInt(data, 10)
			// date.setTime(data * 1000)
			// return true
			const timestamp = parseInt(data)
			date.setTime(timestamp * 1000)
			return true
		},
	},

	c: locale.c,
	r: locale.r,
	R: '%H:%M',
	T: '%H:%M:%S',
	x: locale.x,
	X: locale.X,
	D: '%m/%d/%y',
	F: '%Y-%m-%d',

	Date_iso: '%Y-%m-%dT%H:%M:%S',
	Date_dBY_year_in_HM: locale.Date_dBY_year_in_HM,
	Date_dBY_year: locale.Date_dBY_year,
	Date_dBY: locale.Date_dBY,
	Date_dBA: locale.Date_dBA,
	Date_AdBY: locale.Date_AdBY,
	Date_df_in_HM: locale.Date_df_in_HM,
	Date_dfY: locale.Date_dfY,
	Date_dB_in_HM: locale.Date_dB_in_HM,
	Date_dmY__dot: '%d.%m.%Y',
	Date_df: locale.Date_df,
	Date_FT: '%F %T',
	Date_dmY__minus: '%d-%m-%Y',
}

// bad code but it works
const make: [(date: Date, data: string, mod: string, gen: boolean) => boolean, string, boolean][] =
	[]

export function strptime(str: string, format: string, local: boolean): Date | null {
	let loop = 5
	while (/%(Date_[a-zA-Z0-9_]+|[cDFrRTxX])/g.test(format) && loop) {
		format = format.replace(/%(Date_[a-zA-Z0-9_]+|[cDFrRTxX])/, formatTransform)
		loop--
	}

	const reg = format.replace(
		/%(([#^!~]{0,2})[aAbBfh]|([0\-_]?)[degHImMSVWyl]|[GnpPtuUwYzZs%])/g,
		formatTransform
	)

	const match = str.match(new RegExp(reg))

	if (!match || !make.length) return null

	const date = new Date(Date.UTC(0, 0))

	for (let i = 0, l = make.length; i < l; i++) {
		const build = make[i]
		if (!build[0](date, match[i + 1], build[1], build[2])) {
			return null
		}
	}

	if (local) {
		date.setTime(date.getTime() + date.getTimezoneOffset() * 60000)
	}

	return date
}

function formatTransform(_: any, spec: string, mod: string, numPad: any, pos: number, str: string) {
	spec = spec.replace(/^[#_0^\-!~]+/, '')

	const s = specifiers[spec]

	if (!s) return _

	let genitive = false
	if (
		mod.indexOf('!') === -1 &&
		spec.length === 1 &&
		(mod.indexOf('~') > -1 ||
			('bBf'.indexOf(spec) > -1 && /%[0\-_]?d[\s]+$/.test(str.slice(0, pos))))
	) {
		genitive = true
	}

	if ((spec === 'I' || spec === 'l') && !/%[pP]/.test(str)) {
		throw new Error('Undefined AM/PM')
	}

	// TODO Add check for repeating formats

	switch (typeof s) {
		case 'string':
			return s
		case 'object':
			make.push([s.make, mod, genitive])
			return `(${s.reg})`
		default:
			return _
	}
}

/**
 * @param {String} str
 * @param {String} [mode]
 * @returns {String}
 */
function toLetterCaseReverse(str: string, mode: string): string {
	if (mode.includes('#')) return str.slice(0, 1).toUpperCase() + str.slice(1)

	if (mode.includes('^')) return str.slice(0, 1) + str.slice(1).toLowerCase()

	return str
}
