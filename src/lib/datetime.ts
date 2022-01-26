

const weekdays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
]

const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
]

interface ParsedDate {
    weekday: number | null,
    day: number | null,
    month: number | null,
    year: number | null
}

export function strptime(dateString: string, format: string): ParsedDate {
    let formatRemaining = format
    let dateStringRemaining = dateString

    const parsed: ParsedDate = {
        weekday: null,
        day: null,
        month: null,
        year: null,
    }

    // https://docs.python.org/3/library/datetime.html
    while (formatRemaining) {
        if (formatRemaining.startsWith('%')) {
            switch (formatRemaining[1]) {
                case 'A':
                    // Weekday as locale's full name.
                    for (const weekday of weekdays) {
                        if (dateStringRemaining.toLowerCase().startsWith(weekday)) {
                            dateStringRemaining = dateStringRemaining.slice(weekday.length)
                            parsed.weekday = weekdays.indexOf(weekday)
                            break
                        }
                    }
                    if (!parsed.weekday)
                        throw Error('Unknown weekday')
                    break
                case 'd':
                    // Day of the month as a zero-padded decimal number.
                    parsed.day = parseInt(dateStringRemaining.slice(0, 2))
                    dateStringRemaining = dateStringRemaining.slice(2)
                    break
                case 'B':
                    // Month as locale's full name.
                    for (const month of months) {
                        if (dateStringRemaining.toLowerCase().startsWith(month)) {
                            dateStringRemaining = dateStringRemaining.slice(month.length)
                            parsed.month = months.indexOf(month)
                            break
                        }
                    }
                    break
                case 'Y':
                    // Year with century as a decimal number.
                    parsed.year = parseInt(dateStringRemaining.slice(0, 4))
                    dateStringRemaining = dateStringRemaining.slice(4)
                    break
                default:
                    throw Error(`Unknown format code "${formatRemaining[1]}"`)
            }
            formatRemaining = formatRemaining.slice(2)
        } else if (formatRemaining[0] === dateStringRemaining[0]) {
            formatRemaining = formatRemaining.slice(1)
            dateStringRemaining = dateStringRemaining.slice(1)
        } else {
            throw Error(`Date string doesn\'t match format. String: "${dateStringRemaining}", Format: "${formatRemaining}"`)
        }
    }

    console.log(parsed)

    let date = new Date()

    // weekday: -1,
    // day: -1,
    // month: -1,
    // year: -1

    if (parsed.weekday !== null)
        date.setDate(parsed.weekday)
    if (parsed.day !== null)
        date.setDate(parsed.day)
    if (parsed.month !== null)
        date.setDate(parsed.month)
    if (parsed.year !== null)
        date.setDate(parsed.year)
    
    return date
}

console.log(strptime('Monday 11. March 2002', '%A %d. %B %Y'))

